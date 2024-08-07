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

    public async OnClickExpand() {
        if (this.parent.isExpand.value) {
            this.parent.isExpand.value = false;
            const size = await Renderer.Widget.GetSize();
            localStorage.setItem('Expand', '0');
            localStorage.setItem('AllWidth', `${size.width}`);
            localStorage.setItem('AllHeight', `${size.height}`);
            await Renderer.Widget.SetSize(50, 50);
            await Renderer.Widget.SetResizable(false);
        } else {
            this.parent.isExpand.value = true;
            localStorage.setItem('Expand', '1');
            const width = parseInt(localStorage.getItem('AllWidth') || '340');
            const height = parseInt(localStorage.getItem('AllHeight') || '150');
            await Renderer.Widget.SetSize(width, height);
            await Renderer.Widget.SetResizable(true);
        }
    }
}

export { Tab };
