import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import MonacoEditor from "@components/MonacoEditor";
import { OnMount } from "@monaco-editor/react";
import "./index.less";
import useStore from "@src/store/rootStore";
import { observer } from "mobx-react-lite";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import { useEffect, useRef, useState } from "react";
import { isNumber } from "lodash";
import JsonToTable from "@src/components/JsonToTable";
import { safelyJSONParse } from "@src/utils";

function App(): JSX.Element {
  const { handleInputJsonChange, hasParsedJsonValue, inputJsonValue } =
    useStore();
  // 实现滚动距离的同步
  const editorRef1 = useRef(null);
  const editorRef2 = useRef(null);

  const handleEditorMount =
    (idx): OnMount =>
    (editor, monaco) => {
      if (idx === 1) {
        editorRef1.current = editor;
      } else {
        editorRef2.current = editor;
      }
      if (editorRef1.current && editorRef2.current) {
        const editor1 = editorRef1.current;
        const editor2 = editorRef2.current;
        const syncScroll = (e) => {
          const { scrollTop } = e;
          if (isNumber(scrollTop)) {
            editor1.setScrollTop(scrollTop, 0);
            editor2.setScrollTop(scrollTop, 0);
          }
        };
        editor1.onDidScrollChange(syncScroll);
        editor2.onDidScrollChange(syncScroll);
      }
    };
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let cmdDown = false;

    const handleKeyDown = (event) => {
      if (event.key === "Meta") {
        cmdDown = true;
        // 禁用滚动
        document.body.style.overflow = "hidden";
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Meta") {
        cmdDown = false;
        document.body.style.overflow = "auto";
      }
    };

    // 防抖函数
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };

    // 带有防抖功能的滚轮事件处理函数
    const debouncedHandleWheel = debounce((event) => {
      // 最小缩放比例为0.1，最大缩放比例为1
      const minScale = 0.05;
      const maxScale = 1;

      const oldScale = scale;
      let newScale = scale + Math.sign(event.deltaY) * -0.05; // 步进值为0.05
      newScale = Math.min(Math.max(newScale, minScale), maxScale);

      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left; // x position within the element.
      const y = event.clientY - rect.top; // y position within the element.

      const scrollTop = document.documentElement.scrollTop;
      const scrollLeft = document.documentElement.scrollLeft;

      setScale(newScale);

      // 调整滚动条的位置
      document.documentElement.scrollTop =
        scrollTop + y * (newScale - oldScale);
      document.documentElement.scrollLeft =
        scrollLeft + x * (newScale - oldScale);
    }, 100); // 防抖的等待时间为100毫秒

    // 阻止默认行为的滚轮事件处理函数
    const handleWheel = (event) => {
      if (cmdDown) {
        event.preventDefault();
        debouncedHandleWheel(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="app-container">
      <Tabs>
        <TabList>
          <Tab>深度 Parse</Tab>
          <Tab>表格预览</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="json-parse-container">
            <SplitterLayout defaultSize="50%">
              <MonacoEditor
                height="100%"
                width="100%"
                value={inputJsonValue}
                onChange={handleInputJsonChange}
                onMount={handleEditorMount(1)}
                options={{
                  wordWrap: "off",
                }}
              />
              <MonacoEditor
                height="100%"
                width="100%"
                value={hasParsedJsonValue}
                onMount={handleEditorMount(2)}
                options={{
                  wordWrap: "off",
                }}
              />
            </SplitterLayout>
          </TabPanel>
          <TabPanel>
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <JsonToTable data={safelyJSONParse(hasParsedJsonValue)} />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default observer(App);
