import { AActor } from '@/Libs/AActor';
import { onMounted, onUnmounted, ref, toRaw } from 'vue';
import { Application } from '../../Application';
import addIcon from '@/Assets/MC/add.png';
import typeIcon from '@/Assets/MC/type.png';
import { Mark } from '@/Instructions/Mark';

class Tab extends AActor {
    public constructor(parent: Application) {
        super();
        this.parent = parent;
    }

    private parent!: Application;

    private btns = ref<Array<{ icon: string; label: string }>>([
        {
            icon: typeIcon,
            label: '分类'
        },
        {
            icon: addIcon,
            label: '添加'
        }
    ]);

    public types = ref<Array<string>>(['A']);

    public lastRead = ref<string>('');

    public isShowType = ref<boolean>(false);

    private isShowError = ref<boolean>(false);

    private errorMsg = ref<string>('请先选择分类');

    private timer!: number;

    public InitStates() {
        return {
            btns: this.btns,
            types: this.types,
            isShowType: this.isShowType,
            lastRead: this.lastRead,
            isShowError: this.isShowError,
            errorMsg: this.errorMsg
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
        if (e === '分类') {
            this.isShowType.value = !this.isShowType.value;
        } else if (e === '添加') {
            localStorage.setItem('IMark_Current', JSON.stringify({ edit: false, fileType: this.lastRead.value, types: toRaw(this.types.value) }));
            await this.OnClickAdd();
        }
    }

    public async OnClickAdd() {
        if (this.lastRead.value) {
            await Renderer.App.CreateWidget(`Update`, {
                alwaysOnTop: true,
                center: true,
                width: 820,
                height: 480,
                url: location.href.replace('Application', `Update`),
                decorations: false,
                transparent: true,
                visible: false,
                focus: false,
                skipTaskbar: false
            });
        } else {
            this.isShowError.value = true;
            this.errorMsg.value = '请先选择分类';
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.isShowError.value = false;
            }, 2000);
        }
    }

    public async OnClickType(type: string) {
        if (type === '添加') {
            localStorage.setItem('IMark_Type', JSON.stringify({ name: '' }));
            await Renderer.App.CreateWidget(`Type`, {
                alwaysOnTop: true,
                center: true,
                width: 420,
                height: 150,
                url: location.href.replace('Application', `Type`),
                decorations: false,
                transparent: true,
                visible: false,
                focus: false,
                skipTaskbar: false
            });
        } else {
            if (this.lastRead.value !== type) {
                this.lastRead.value = type;
                localStorage.setItem('IMark_Read', type);
                const json: Array<Mark.MarkDetail> = JSON.parse(await Renderer.Resource.ReadStringFromFile(await Renderer.Resource.GetPathByName(`Mission/${type}.json`, false)));
                this.parent.mission.list.value.splice(0, this.parent.mission.list.value.length, ...json);
            }
            this.isShowType.value = false;
        }
    }

    public OnClickDeleteType(type: string) {
        Renderer.Dialog.Confirm('是否确认删除', {
            title: '删除分类',
            okLabel: '确认',
            cancelLabel: '取消'
        }).then(async (flag) => {
            if (flag) {
                const targetFile = await Renderer.Resource.GetPathByName(`Mission/${type}.json`, false);
                await Renderer.Resource.RemoveFile(targetFile);
                if (this.lastRead.value === type) {
                    this.parent.mission.list.value.splice(0, this.parent.mission.list.value.length);
                    this.lastRead.value = '';
                    localStorage.setItem('IMark_Read', '');
                }
                const index = this.types.value.findIndex((t) => t === type);
                if (index !== -1) {
                    this.types.value.splice(index, 1);
                }
            }
        });
    }

    public async OnClickEditType(type: string) {
        localStorage.setItem('IMark_Type', JSON.stringify({ name: type }));
        await Renderer.App.CreateWidget(`Type`, {
            alwaysOnTop: true,
            center: true,
            width: 420,
            height: 150,
            url: location.href.replace('Application', `Type`),
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
            localStorage.setItem('IMark_Expand', '0');
            localStorage.setItem('IMark_Expand_Width', `${size.width}`);
            localStorage.setItem('IMark_Expand_Height', `${size.height}`);
            await Renderer.Widget.SetSize(50, 50);
            await Renderer.Widget.SetResizable(false);
        } else {
            this.parent.isExpand.value = true;
            localStorage.setItem('IMark_Expand', '1');
            const width = parseInt(localStorage.getItem('IMark_Expand_Width') || '340');
            const height = parseInt(localStorage.getItem('IMark_Expand_Height') || '150');
            await Renderer.Widget.SetSize(width, height);
            await Renderer.Widget.SetResizable(true);
        }
    }
}

export { Tab };
