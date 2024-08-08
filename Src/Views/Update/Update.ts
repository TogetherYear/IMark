import { Mark } from '@/Instructions/Mark';
import { AActor } from '@/Libs/AActor';
import { Time } from '@/Utils/Time';
import { onMounted, onUnmounted, reactive, ref, toRaw } from 'vue';

class Update extends AActor {
    public constructor() {
        super();
    }

    private options = reactive<{ type: string; label: string; images: Array<string>; fileType: string }>({
        type: '',
        label: '',
        images: [],
        fileType: ''
    });

    private types = ref<Array<string>>([]);

    private allowTypes = ['jpg', 'png', 'bmp', 'webp', 'gif'];

    private editId = '';

    private isExpand = false;

    public InitStates() {
        return {
            options: this.options,
            types: this.types
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(async () => {
            this.ListenEvents();
            await this.GetDefaultValues();
            await Renderer.Widget.SetShadow(true);
            await Renderer.Widget.Show();
        });

        onUnmounted(() => {
            this.Destroy();
        });
    }

    public Destroy() {}

    private ListenEvents() {
        Renderer.AddListen(Renderer.RendererEvent.FileDrop, this, this.OnFileDrop);
    }

    private OnFileDrop(e: IT.IRendererSendMessage) {
        const files = e.extra!.files as Array<{ isFile: boolean; path: string }>;
        const result: Array<string> = [];
        files.forEach((f) => {
            const type = f.path.split('.').slice(-1)[0].toLowerCase();
            if (f.isFile && this.allowTypes.indexOf(type) != -1) {
                result.push(Renderer.Resource.ConvertFileSrcToTauri(f.path));
            }
        });
        this.options.images.push(...result);
    }

    private async GetDefaultValues() {
        const result = JSON.parse(localStorage.getItem('Current')!) as Mark.MarkDetail & { edit: boolean; types: Array<string> };
        if (result.edit) {
            this.editId = result.id;
            this.isExpand = result.expand;
            this.options.type = result.type;
            this.options.label = result.label;
            this.options.images.splice(0, this.options.images.length, ...result.images);
        }
        this.options.fileType = result.fileType;
        this.types.value.splice(0, this.types.value.length, ...result.types);
        console.log(result);
    }

    public OnClickFileType(type: string) {
        this.options.fileType = type;
    }

    public OnClickDelete(index: number) {
        this.options.images.splice(index, 1);
    }

    public async OnClickSure() {
        Renderer.Event.Emit(Renderer.Event.TauriEvent.TAURI, { event: Renderer.RendererEvent.UpdateMission, extra: { ...toRaw(this.options), id: this.editId, expand: this.isExpand } });
        await Renderer.Widget.Close();
    }

    public async OnClickImage(url: string) {
        localStorage.setItem('Image', JSON.stringify({ url, type: this.options.type, label: this.options.label }));
        await Renderer.App.CreateWidget(`Picture_${Time.GenerateRandomUid()}`, {
            alwaysOnTop: true,
            center: true,
            width: 1040,
            height: 560,
            url: location.href.replace('Update', `Picture`),
            decorations: false,
            transparent: true,
            visible: false,
            focus: false,
            skipTaskbar: false
        });
    }
}

export { Update };
