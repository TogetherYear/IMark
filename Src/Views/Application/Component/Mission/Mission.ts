import { AActor } from '@/Libs/AActor';
import { onMounted, onUnmounted, ref, toRaw } from 'vue';
import { Application } from '../../Application';
import { Mark } from '@/Instructions/Mark';
import { Time } from '@/Utils/Time';

class Mission extends AActor {
    public constructor(parent: Application) {
        super();
        this.parent = parent;
    }

    private parent!: Application;

    public list = ref<Array<Mark.MarkDetail>>([]);

    public listDom = ref<HTMLSpanElement | null>(null);

    public InitStates() {
        return {
            list: this.list,
            listDom: this.listDom
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(async () => {
            await this.GetExistMission();
        });

        onUnmounted(() => {
            this.Destroy();
        });
    }

    public Destroy() {}

    private async UpdateCurrentFile() {
        const json = JSON.stringify(toRaw(this.list.value));
        await Renderer.Resource.WriteStringToFile(await Renderer.Resource.GetPathByName(`Mission/${this.parent.tab.lastRead.value}.json`, false), json);
    }

    private async GetExistMission() {
        const files = await Renderer.Resource.ReadDirFiles(await Renderer.Resource.GetPathByName('Mission', false));
        this.parent.tab.types.value.splice(0, this.parent.tab.types.value.length, ...files.map((f) => f.name!.split('.json')[0]));
        let lastRead = localStorage.getItem('Read') || '';
        if (this.parent.tab.types.value.indexOf(lastRead) === -1) {
            lastRead = files.length === 0 ? '' : files[0].name!.split('.json')[0];
        }
        if (await Renderer.Resource.IsPathExists(await Renderer.Resource.GetPathByName(`Mission/${lastRead}.json`, false))) {
            this.parent.tab.lastRead.value = lastRead;
            localStorage.setItem('Read', lastRead);
            const json: Array<Mark.MarkDetail> = JSON.parse(await Renderer.Resource.ReadStringFromFile(await Renderer.Resource.GetPathByName(`Mission/${lastRead}.json`, false)));
            this.list.value.splice(0, this.list.value.length, ...json);
        }
    }

    public async OnClickExpand(m: Mark.MarkDetail) {
        m.expand = !m.expand;
        await this.UpdateCurrentFile();
    }

    public async AddMission(m: Mark.MarkDetail, position = 0) {
        const old = this.list.value.findIndex((l) => l.id == m.id);
        if (m.fileType === this.parent.tab.lastRead.value) {
            if (old != -1) {
                this.list.value.splice(old, 1, m);
            } else {
                this.list.value.splice(position, 0, m);
            }
            await this.UpdateCurrentFile();
        } else {
            if (old != -1) {
                this.list.value.splice(old, 1);
                await this.UpdateCurrentFile();
            }
            const targetFile = await Renderer.Resource.GetPathByName(`Mission/${m.fileType}.json`, false);
            const json: Array<Mark.MarkDetail> = (await Renderer.Resource.IsPathExists(targetFile)) ? JSON.parse(await Renderer.Resource.ReadStringFromFile(targetFile)) : [];
            json.splice(0, 0, m);
            await Renderer.Resource.WriteStringToFile(targetFile, JSON.stringify(json));
        }
    }

    public async OnClickEdit(e: Mark.MarkDetail) {
        localStorage.setItem('Current', JSON.stringify({ ...toRaw(e), edit: true, types: toRaw(this.parent.tab.types.value) }));
        this.parent.tab.OnClickAdd();
    }

    public OnClickDelete(e: Mark.MarkDetail) {
        Renderer.Dialog.Confirm('是否确认删除', {
            title: '删除任务',
            okLabel: '确认',
            cancelLabel: '取消'
        }).then(async (flag) => {
            if (flag) {
                const index = this.list.value.findIndex((l) => l.id == e.id);
                this.list.value.splice(index, 1);
                await this.UpdateCurrentFile();
            }
        });
    }

    public async OnClickImage(e: Mark.MarkDetail) {
        localStorage.setItem('Image', JSON.stringify({ url: e.images[e.current], type: e.type, label: e.label }));
        await Renderer.App.CreateWidget(`Picture_${Time.GenerateRandomUid()}`, {
            alwaysOnTop: true,
            center: true,
            width: 1040,
            height: 560,
            url: location.href.replace('Application', `Picture`),
            decorations: false,
            transparent: true,
            visible: false,
            focus: false,
            skipTaskbar: false
        });
    }

    public async OnClickToB(index: number) {
        const current = this.list.value.splice(index, 1)[0];
        this.list.value.splice(index + 1, 0, current);
        await this.UpdateCurrentFile();
    }

    public async OnClickToT(index: number) {
        const current = this.list.value.splice(index, 1)[0];
        this.list.value.splice(index - 1, 0, current);
        await this.UpdateCurrentFile();
    }

    public async OnClickToFirst(index: number) {
        const current = this.list.value.splice(index, 1)[0];
        this.list.value.splice(0, 0, current);
        await this.UpdateCurrentFile();
    }
}

export { Mission };
