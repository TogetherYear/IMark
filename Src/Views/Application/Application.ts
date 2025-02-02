import { onMounted, onUnmounted, ref, toRaw } from 'vue';
import { AActor } from '@/Libs/AActor';
import { Tab } from './Component/Tab/Tab';
import { Mission } from './Component/Mission/Mission';
import { Mark } from '@/Instructions/Mark';
import { Time } from '@/Utils/Time';
import * as W from '@tauri-apps/api/window';

class Application extends AActor {
    public constructor() {
        super();
    }

    public tab = new Tab(this);

    public mission = new Mission(this);

    public isExpand = ref<boolean>(true);

    public InitStates() {
        return {
            isExpand: this.isExpand
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(async () => {
            this.ListenEvents();
            Renderer.App.UpdateAutostartFlag(await Renderer.App.IsAutostart());
            await this.GetStates();
            await Renderer.Widget.Show();
            await Renderer.Widget.SetAlwaysOnTop(true);
        });
        onUnmounted(async () => {
            await Renderer.GlobalShortcut.UnregisterAll();
            this.Destroy();
        });
    }

    protected Destroy() {}

    private async GetStates() {
        const screen = await Renderer.Monitor.GetPrimaryMonitor();
        const width = parseInt(localStorage.getItem('IMark_Normal_Width') || '340');
        const height = parseInt(localStorage.getItem('IMark_Normal_Height') || '150');
        const x = parseInt(localStorage.getItem('IMark_X') || `${screen.x + screen.width - width - 50}`);
        const y = parseInt(localStorage.getItem('IMark_Y') || `${screen.y + 50}`);
        await Renderer.Widget.SetPosition(x, y);
        const expand = parseInt(localStorage.getItem('IMark_Expand') || '1');
        this.isExpand.value = expand === 1;
        await Renderer.Widget.SetSize(this.isExpand.value ? width : 50, this.isExpand.value ? height : 50);
        W.appWindow.onResized(async (e) => {
            localStorage.setItem('IMark_Normal_Width', `${e.payload.width}`);
            localStorage.setItem('IMark_Normal_Height', `${e.payload.height}`);
        });
        W.appWindow.onMoved(async (e) => {
            localStorage.setItem('IMark_X', `${e.payload.x}`);
            localStorage.setItem('IMark_Y', `${e.payload.y}`);
        });
    }

    private ListenEvents() {
        Renderer.AddListen(Renderer.RendererEvent.SecondInstance, this, this.OnSecondInstance);
        Renderer.AddListen(Renderer.RendererEvent.UpdateMission, this, this.OnUpdateMission);
        Renderer.AddListen(Renderer.RendererEvent.UpdateType, this, this.OnUpdateType);
        window.addEventListener('click', () => {
            this.tab.isShowType.value = false;
        });
    }

    private async OnSecondInstance(e: IT.IRendererSendMessage) {
        await Renderer.Widget.Show();
    }

    private OnUpdateMission(e: IT.IRendererSendMessage) {
        const data = e.extra as { type: string; label: string; images: Array<string>; id: string; expand: boolean; fileType: string };
        const newMission: Mark.MarkDetail = {
            ...data,
            id: data.id || Time.GenerateRandomUid(),
            time: Time.GetTime(),
            current: 0
        };
        this.mission.AddMission(newMission);
    }

    private async OnUpdateType(e: IT.IRendererSendMessage) {
        const data = e.extra as { lastName: string; name: string };
        if (data.lastName !== data.name) {
            if (data.lastName === this.tab.lastRead.value) {
                localStorage.setItem('IMark_Read', data.name);
                this.tab.lastRead.value = data.name;
            }
            const index = this.tab.types.value.findIndex((t) => t === data.lastName);
            if (index !== -1) {
                this.tab.types.value.splice(index, 1, data.name);
            }
            const targetFile = await Renderer.Resource.GetPathByName(`Mission/${data.name}.json`, false);
            if (data.lastName) {
                const lastFile = await Renderer.Resource.GetPathByName(`Mission/${data.lastName}.json`, false);
                this.mission.list.value.forEach((l) => {
                    l.fileType = data.name;
                });
                await Renderer.Resource.WriteStringToFile(lastFile, JSON.stringify(toRaw(this.mission.list.value)));
                await Renderer.Resource.Rename(lastFile, targetFile);
            } else {
                this.tab.types.value.push(data.name);
                await Renderer.Resource.WriteStringToFile(targetFile, JSON.stringify([]));
            }
        }
    }
}

export { Application };
