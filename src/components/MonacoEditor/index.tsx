import { isString } from "lodash";
import { safelyJSONParse } from "@src/utils";
import "./userWorker";

import ControlledEditor, { EditorProps } from "@monaco-editor/react";

interface MonacoEditorProps extends EditorProps {
  enableFormat?: boolean;
  onChange?: (value: any) => void;
}

const MonacoEditor = ({
  value,
  defaultValue,
  onChange,
  enableFormat,
  ...restProps
}: MonacoEditorProps) => {
  const handleChange = (newValue: any) => {
    console.log("🚀 ~ file: index.tsx ~ line 7 ~ handleChange ~ value", {
      value: newValue,
    });
    const changeValue = !newValue ? undefined : newValue;
    onChange &&
      onChange(
        enableFormat ? safelyJSONParse(changeValue) || changeValue : changeValue
      );
  };
  return (
    <ControlledEditor
      className="codeEditor"
      width="100%"
      height="200px"
      defaultLanguage="json"
      theme="vs-dark"
      value={value}
      defaultValue={
        isString(defaultValue)
          ? defaultValue
          : JSON.stringify(defaultValue, null, 2)
      }
      onChange={handleChange}
      options={{
        maxTokenizationLineLength: Infinity,
        ...restProps?.options,
      }}
      {...restProps}
    />
  );
};

export default MonacoEditor;
