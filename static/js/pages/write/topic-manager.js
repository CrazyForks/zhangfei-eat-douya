/**
 * 主题输入管理
 * 负责主题输入框的添加、删除、获取等操作
 */

class TopicManager {
    constructor(options = {}) {
        this.container = options.container;
        this.addButton = options.addButton;
        this.clearButton = options.clearButton;
        this.maxTopics = options.maxTopics || 50;
        this.topicCount = 0;
        this.stateManager = options.stateManager;
        this.onImageSettingClick = options.onImageSettingClick;

        this.init();
    }

    init() {
        // 添加主题按钮事件
        this.addButton.addEventListener('click', () => this.addTopic());

        // 清空按钮事件
        this.clearButton.addEventListener('click', () => this.clearAll());
    }

    /**
     * 添加主题输入框
     */
    addTopic(value = '') {
        if (this.topicCount >= this.maxTopics) {
            toast.warning(`最多只能添加 ${this.maxTopics} 个标题`);
            return null;
        }

        const currentIndex = this.topicCount;
        const wrapper = this.createTopicWrapper(currentIndex, value);

        this.container.appendChild(wrapper);
        this.topicCount++;
        this.updateAddButtonState();

        return wrapper;
    }

    /**
     * 创建主题输入框包装元素
     */
    createTopicWrapper(index, value = '') {
        const wrapper = document.createElement('div');
        wrapper.className = 'topic-input-wrapper slide-in-left';
        wrapper.dataset.index = index;

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `标题 ${index + 1}`;
        input.className = 'topic-input';
        input.value = value;

        // 监听输入变化，自动保存状态（使用防抖）
        input.addEventListener('input', Utils.debounce(() => {
            this.saveState();
        }, 500));

        // 创建图片设置按钮
        const imageBtn = document.createElement('button');
        imageBtn.textContent = '🖼️ 图片设置';
        imageBtn.className = 'image-set-btn';
        imageBtn.type = 'button';
        imageBtn.onclick = () => {
            if (this.onImageSettingClick) {
                this.onImageSettingClick(parseInt(wrapper.dataset.index));
            }
        };

        // 根据索引决定显示清空还是删除按钮
        wrapper.appendChild(input);
        wrapper.appendChild(imageBtn);

        if (index === 0) {
            // 第一个输入框显示清空按钮
            const clearBtn = document.createElement('button');
            clearBtn.textContent = '清空';
            clearBtn.className = 'clear-input-btn';
            clearBtn.onclick = () => this.clearTopic(wrapper);
            wrapper.appendChild(clearBtn);
        } else {
            // 其他输入框显示删除按钮
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '删除';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => this.removeTopic(wrapper);
            wrapper.appendChild(removeBtn);
        }

        return wrapper;
    }

    /**
     * 清空主题内容（保留输入框）
     */
    clearTopic(wrapper) {
        const index = parseInt(wrapper.dataset.index);
        const input = wrapper.querySelector('.topic-input');

        input.value = '';
        this.stateManager.deleteTopicImage(index);
        this.updateImageButtonStatus(index, false);
        this.saveState();
    }

    /**
     * 移除主题输入框
     */
    removeTopic(wrapper) {
        const index = parseInt(wrapper.dataset.index);

        this.stateManager.deleteTopicImage(index);
        wrapper.classList.add('fade-out');

        setTimeout(() => {
            wrapper.remove();
            this.topicCount--;
            this.updateAddButtonState();
            this.saveState();
        }, 300);
    }

    /**
     * 清空所有输入
     */
    clearAll() {
        this.container.innerHTML = '';
        this.topicCount = 0;
        this.stateManager.clearAllImages();
        this.addTopic();
        this.saveState();
        toast.info('已清空所有标题');
    }

    /**
     * 获取所有主题
     */
    getAllTopics() {
        const inputs = this.container.querySelectorAll('.topic-input');
        const topics = [];

        inputs.forEach(input => {
            const value = input.value.trim();
            if (value) {
                topics.push(value);
            }
        });

        return topics;
    }

    /**
     * 更新图片按钮状态
     */
    updateImageButtonStatus(topicIndex, hasImage) {
        const wrapper = this.container.querySelector(`.topic-input-wrapper[data-index="${topicIndex}"]`);
        if (!wrapper) return;

        const imageBtn = wrapper.querySelector('.image-set-btn');
        if (!imageBtn) return;

        if (hasImage) {
            imageBtn.classList.add('has-image');
            imageBtn.innerHTML = '🖼️ 已设置 <span class="image-indicator"></span>';
        } else {
            imageBtn.classList.remove('has-image');
            imageBtn.textContent = '🖼️ 图片设置';
        }
    }

    /**
     * 更新添加按钮状态
     */
    updateAddButtonState() {
        this.addButton.disabled = this.topicCount >= this.maxTopics;

        if (this.topicCount >= this.maxTopics) {
            this.addButton.textContent = `已达到最大数量 (${this.maxTopics})`;
        } else {
            this.addButton.textContent = '+ 添加标题';
        }
    }

    /**
     * 恢复状态
     */
    restoreState() {
        const state = this.stateManager.restorePageState();

        if (state && state.topics && state.topics.length > 0) {
            // 恢复主题
            state.topics.forEach(topic => {
                this.addTopic(topic);
            });

            // 恢复图片按钮状态
            this.stateManager.topicImages.forEach((imageData, index) => {
                this.updateImageButtonStatus(index, true);
            });

            return state;
        } else {
            // 没有保存的状态，添加第一个输入框
            this.addTopic();
            return null;
        }
    }

    /**
     * 保存状态
     */
    saveState() {
        const topics = this.getAllTopics();
        const enableImage = document.getElementById('enableImage')?.checked || false;
        this.stateManager.savePageState(topics, enableImage);
    }
}

// 导出到全局
window.TopicManager = TopicManager;
