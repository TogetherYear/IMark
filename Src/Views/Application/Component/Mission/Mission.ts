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

    private list = ref<Array<Mark.MarkDetail>>([]);

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

    private async UpdateFile() {
        const json = JSON.stringify(toRaw(this.list.value));
        await Renderer.Resource.WriteStringToFile(await Renderer.Resource.GetPathByName('Configs/Exist.json', false), json);
    }

    private async GetExistMission() {
        const json: Array<Mark.MarkDetail> = JSON.parse(await Renderer.Resource.ReadStringFromFile(await Renderer.Resource.GetPathByName('Configs/Exist.json', false)));
        this.list.value.splice(0, this.list.value.length, ...json);
    }

    public async OnClickExpand(m: Mark.MarkDetail) {
        m.expand = !m.expand;
        await this.UpdateFile();
    }

    public async AddMission(m: Mark.MarkDetail, position = 0) {
        const old = this.list.value.findIndex((l) => l.id == m.id);
        if (old != -1) {
            this.list.value.splice(old, 1, m);
        } else {
            this.list.value.splice(position, 0, m);
        }
        await this.UpdateFile();
    }

    public async OnClickEdit(e: Mark.MarkDetail) {
        localStorage.setItem('Current', JSON.stringify({ ...toRaw(e), edit: true }));
        this.parent.tab.OnClickAdd();
    }

    public async OnClickDelete(e: Mark.MarkDetail) {
        const index = this.list.value.findIndex((l) => l.id == e.id);
        this.list.value.splice(index, 1);
        await this.UpdateFile();
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
        await this.UpdateFile();
    }

    public async OnClickToT(index: number) {
        const current = this.list.value.splice(index, 1)[0];
        this.list.value.splice(index - 1, 0, current);
        await this.UpdateFile();
    }

    public async OnClickToFirst(index: number) {
        const current = this.list.value.splice(index, 1)[0];
        this.list.value.splice(0, 0, current);
        await this.UpdateFile();
    }
}

export { Mission };