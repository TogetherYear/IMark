import { AActor } from '@/Libs/AActor';
import { onMounted, onUnmounted, ref } from 'vue';

class Type extends AActor {
    public constructor() {
        super();
    }

    private name = ref<string>('');

    private lastName = '';

    private isShowError = ref<boolean>(false);

    private errorMsg = ref<string>('请输入分类');

    private timer!: number;

    public InitStates() {
        return {
            name: this.name,
            isShowError: this.isShowError,
            errorMsg: this.errorMsg
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(async () => {
            await this.GetDefaultValues();
            await Renderer.Widget.SetShadow(true);
            await Renderer.Widget.Show();
        });

        onUnmounted(() => {
            this.Destroy();
        });
    }

    public Destroy() {}

    private async GetDefaultValues() {
        const result = JSON.parse(localStorage.getItem('IMark_Type')!) as { name: string };
        this.name.value = result.name;
        this.lastName = result.name;
    }

    public async OnClickFinish() {
        if (this.name.value) {
            Renderer.Event.Emit(Renderer.Event.TauriEvent.TAURI, { event: Renderer.RendererEvent.UpdateType, extra: { name: this.name.value, lastName: this.lastName } });
            await Renderer.Widget.Close();
        } else {
            this.isShowError.value = true;
            this.errorMsg.value = '请输入分类';
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.isShowError.value = false;
            }, 2000);
        }
    }
}

export { Type };
