import { onMounted, onUnmounted, ref } from 'vue';
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
        const width = parseInt(localStorage.getItem('width') || '340');
        const height = parseInt(localStorage.getItem('height') || '150');
        const x = parseInt(localStorage.getItem('x') || `${screen.x + screen.width - width - 50}`);
        const y = parseInt(localStorage.getItem('y') || `${screen.y + 50}`);
        await Renderer.Widget.SetPosition(x, y);
        const expand = parseInt(localStorage.getItem('Expand') || '1');
        this.isExpand.value = expand === 1;
        await Renderer.Widget.SetSize(this.isExpand.value ? width : 50, this.isExpand.value ? height : 50);
        W.appWindow.onResized(async (e) => {
            localStorage.setItem('width', `${e.payload.width}`);
            localStorage.setItem('height', `${e.payload.height}`);
        });
        W.appWindow.onMoved(async (e) => {
            localStorage.setItem('x', `${e.payload.x}`);
            localStorage.setItem('y', `${e.payload.y}`);
        });
    }

    private ListenEvents() {
        Renderer.AddListen(Renderer.RendererEvent.SecondInstance, this, this.OnSecondInstance);
        Renderer.AddListen(Renderer.RendererEvent.UpdateMission, this, this.OnUpdateMission);
    }

    private async OnSecondInstance(e: IT.IRendererSendMessage) {
        await Renderer.Widget.Show();
    }

    private OnUpdateMission(e: IT.IRendererSendMessage) {
        const data = e.extra as { type: string; label: string; images: Array<string>; id: string; expand: boolean };
        const newMission: Mark.MarkDetail = {
            ...data,
            id: data.id || Time.GenerateRandomUid(),
            time: Time.GetTime(),
            current: 0
        };
        this.mission.AddMission(newMission);
    }
}

export { Application };