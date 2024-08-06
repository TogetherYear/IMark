import { AActor } from '@/Libs/AActor';
import { onMounted, onUnmounted, reactive } from 'vue';

class Picture extends AActor {
    public constructor() {
        super();
    }

    private current = reactive({
        url: '',
        type: '',
        label: ''
    });

    public InitStates() {
        return {
            current: this.current
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(async () => {
            const current = JSON.parse(localStorage.getItem('Image')!) as { url: string; type: string; label: string };
            this.current.url = current.url;
            this.current.type = current.type;
            this.current.label = current.label;
            await Renderer.Widget.SetShadow(true);
            await Renderer.Widget.Show();
        });

        onUnmounted(() => {
            this.Destroy();
        });
    }

    public Destroy() {}
}

export { Picture };
