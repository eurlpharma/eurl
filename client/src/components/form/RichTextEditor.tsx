import { FC } from "react";
import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  error,
  placeholder,
  height = 200,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <FormControl fullWidth error={!!error} className="mb-4">
      {label && <FormLabel className="mb-2">{label}</FormLabel>}
      <div
        className={`border rounded-lg font-poppins scrollbar-hide ${
          error ? "border-red-500" : "border-[#919eab33]"
        } overflow-hidden`}
      >
        <ReactQuill
          value={value}
          onChange={onChange}
          placeholder={placeholder || t("form.richTextPlaceholder")}
          style={{ minHeight: height, direction: i18n.dir() }}
          theme="snow"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "bullet",
            "align",
            "clean",
          ]}
        />
      </div>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default RichTextEditor;
