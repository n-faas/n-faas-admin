import { Ref, ref, toRaw, watch } from 'vue';
import * as monaco from 'monaco-editor';
import { useContext } from '~/packages/hooks/src';

export const { setupStore: setupEditor, useStore: useEditor } = useContext('editor', () => {
  const editorContainer = ref<HTMLElement>();
  let editor = null as monaco.editor.IStandaloneCodeEditor | null;
  const editorStates = ref<
    Record<
      string,
      {
        isModified: boolean;
        title: string;
        model: monaco.editor.ITextModel | null;
        viewState: monaco.editor.ICodeEditorViewState | null;
      }
    >
  >({});
  const tabList = ref<string[]>([]);
  const activeFunctionId = ref<string | null>();
  // 切换文件时保存和恢复状态
  // const switchFile = (functionId: string | null) => {
  //   if (!functionId) {
  //     console.log('!functionId')
  //     activeFunctionId.value = null
  //     editor.value?.setModel(null)
  //     return
  //   }
  //   if (functionId === activeFunctionId.value) {
  //     console.log('functionId === activeFunctionId.value')
  //     return
  //   }
  //   if (!editor.value) {
  //     console.log('!editor.value')
  //     return
  //   }
  //   // 1. 保存当前文件的状态
  //   if (activeFunctionId.value && editor.value) {
  //     console.log('activeFunctionId.value && editor.value')
  //     const currentModel = editor.value.getModel();
  //     const currentViewState = editor.value.saveViewState();
  //     editorStates.value[activeFunctionId.value] = {
  //       ...editorStates.value[activeFunctionId.value],
  //       model: currentModel,
  //       viewState: currentViewState
  //     }
  //   }

  //   // 2. 恢复目标文件的状态
  //   const targetState = editorStates.value[functionId];
  //   if (targetState && editor.value) {
  //     console.log('targetState && editor.value', targetState, editor.value)
  //     // debugger
  //     editor.value.setModel(targetState.model);
  //     editor.value.restoreViewState(targetState.viewState);
  //   }

  //   activeFunctionId.value = functionId
  // };

  const handleUpdateEditorContent = (functionId: string, value: string) => {
    // console.log('handleUpdateEditorContent', functionId, value);
    const model = editor?.getModel();
    if (model) {
      editorStates.value[functionId].isModified = true;
    }
  };
  const initEditor = (content: string, editorContainerDom: HTMLElement, functionId: string) => {
    editor = monaco.editor.create(editorContainerDom, {
      value: content,
      language: 'javascript',
      theme: 'vs-light',
      automaticLayout: true,
      minimap: {
        enabled: true
      }
    });
    editorStates.value[functionId] = {
      title: functionId,
      model: editor?.getModel(),
      viewState: null,
      isModified: false
    };
    editor?.onDidChangeModelContent(() => {
      console.log('editor?.onDidChangeModelContent');
      if (activeFunctionId.value) {
        handleUpdateEditorContent(activeFunctionId.value, editor?.getModel()?.getValue() || '');
      }
    });
  };
  const openFile = (functionId: string, title: string, content: string) => {
    if (!editorContainer.value) {
      console.log('编辑器未初始化');
      return;
    }
    if (editor) {
      // 保存当前状态
      if (activeFunctionId.value) {
        const currentModel = editor.getModel();
        const currentViewState = editor.saveViewState();
        editorStates.value[activeFunctionId.value] = {
          ...toRaw(editorStates.value[activeFunctionId.value]),
          title: editorStates.value[activeFunctionId.value]?.title || '',
          model: currentModel,
          viewState: currentViewState
        };
      }

      // 检查已存在的 model 是否有效
      const existingState = editorStates.value[functionId];
      if (existingState?.model && !existingState.model.isDisposed()) {
        if (existingState.model.isDisposed()) {
          // console.log('model存在 但无效', existingState.model);
        } else {
          // model 仍然有效，可以直接使用
          // console.log('model 仍然有效，可以直接使用', existingState.model);
          editor.setModel(toRaw(existingState.model));
          editor.restoreViewState(toRaw(existingState.viewState));
          // console.log('model 仍然有效，可以直接使用 end', existingState.model);
          // editor.focus();
        }
      } else {
        // 如果是新文件，创建新的model
        const newModel = monaco.editor.createModel(content, 'javascript');
        editor.setModel(newModel);
        editorStates.value[functionId] = {
          isModified: false,
          title,
          model: newModel,
          viewState: null
        };
      }
    } else {
      initEditor(content, toRaw(editorContainer.value), functionId);
    }

    // 更新激活状态和标签列表
    activeFunctionId.value = functionId;
    if (!tabList.value.includes(functionId)) {
      tabList.value.push(functionId);
    }
    // console.log('editorStates.value', editorStates.value);
  };

  const closeFile = (functionId: string) => {
    // 保存当前要关闭的标签页索引
    const index = tabList.value.indexOf(functionId);
    if (index !== -1) {
      // 更新标签页数组
      tabList.value = tabList.value.filter(id => id !== functionId);
      // 清理编辑器状态
      delete editorStates.value[functionId];
      //  释放model
      if (editorStates.value[functionId]?.model) {
        editorStates.value[functionId].model.dispose();
      }
    }

    // // 如果关闭的文件是当前激活的文件
    // if (activeFunctionId.value === functionId) {
    //   if (tabList.value.length > 0) {
    //     switchFile(tabList.value[0])
    //   } else {
    //     switchFile(null)
    //   }
    // }
  };

  // 添加一个计算属性来判断文件是否被修改
  const getTabTitle = (tabName: string) => {
    const state = editorStates.value[tabName];
    const isModified = state?.isModified;
    // console.log('getTabTitle', tabName, state);
    return (
      <div class="flex items-center gap-1">
        {tabName}
        {isModified && <div class="h-2 w-2 rounded-full bg-primary" />}
      </div>
    );
  };

  return {
    editorContainer,
    editor,
    editorStates,
    activeFunctionId,
    // switchFile,
    openFile,
    closeFile,
    tabList,
    getTabTitle
  };
});
