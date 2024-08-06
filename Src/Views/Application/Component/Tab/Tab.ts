import { AActor } from '@/Libs/AActor';
import { onMounted, onUnmounted, ref } from 'vue';
import { Application } from '../../Application';
import addIcon from '@/Assets/MC/add.png';

class Tab extends AActor {
    public constructor(parent: Application) {
        super();
        this.parent = parent;
    }

    private parent!: Application;

    private btns = ref<Array<{ icon: string; label: string }>>([
        {
            icon: addIcon,
            label: '添加'
        }
    ]);

    public InitStates() {
        return {
            btns: this.btns
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(() => {});

        onUnmounted(() => {
            this.Destroy();
        });
    }

    public Destroy() {}

    public async OnClickBtn(e: string) {
        if (e === '标签') {
        } else if (e === '添加') {
            localStorage.setItem('Current', JSON.stringify({ edit: false }));
            await this.OnClickAdd();
        }
    }

    public async OnClickAdd() {
        await Renderer.App.CreateWidget(`Update`, {
            alwaysOnTop: true,
            center: true,
            width: 820,
            height: 440,
            url: location.href.replace('Application', `Update`),
            decorations: false,
            transparent: true,
            visible: false,
            focus: false,
            skipTaskbar: false
        });
    }
}

export { Tab };
