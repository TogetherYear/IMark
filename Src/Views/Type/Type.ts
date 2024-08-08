import { AActor } from '@/Libs/AActor';
import { ElMessage } from 'element-plus';
import { onMounted, onUnmounted, ref } from 'vue';

class Type extends AActor {
    public constructor() {
        super();
    }

    private name = ref<string>('');

    private lastName = '';

    public InitStates() {
        return {
            name: this.name
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
        const result = JSON.parse(localStorage.getItem('Type')!) as { name: string };
        this.name.value = result.name;
        this.lastName = result.name;
    }

    public async OnClickFinish() {
        if (this.name.value) {
            Renderer.Event.Emit(Renderer.Event.TauriEvent.TAURI, { event: Renderer.RendererEvent.UpdateType, extra: { name: this.name.value, lastName: this.lastName } });
            await Renderer.Widget.Close();
        } else {
            ElMessage({
                type: 'warning',
                message: `请输入分类！`
            });
        }
    }
}

export { Type };
