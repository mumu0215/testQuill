import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

// 自定义工具栏配置
const toolbarContainerMy = [
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["image", "clean"], // 添加图片上传按钮
    //美食大战老鼠
];


//fffff
//美食大战老鼠
const RichTextEditor = () => {
    const [content, setContent] = useState("");
    const [uploading, setUploading] = useState(false); // 上传状态

    // 配置 ReactQuill 的模块
    const modules = {
        toolbar: {
            container: toolbarContainerMy,
            handlers: {
                image: () => handleImageUpload(),
            },
        },
    };

    // 处理内容变化
    const handleChange = (value) => {
        setContent(value);
    };

    // 模拟保存
    const handleSave = () => {
        console.log("美食大战老鼠，保存的内容：", content);
        alert("内容已保存！");
    };

    // 图片上传处理
    const handleImageUpload = () => {
        if (uploading) {
            alert("图片上传中，请稍候...");
            return;
        }

        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    setUploading(true); // 开始上传
                    const response = await axios.post(
                        "http://192.168.11.49:8088/api/v1/file/upload",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    // 检查返回值并插入图片
                    if (response.data.code === 0 && response.data.data?.length > 0) {
                        const imageUrl = response.data.data[0]; // 获取图片链接
                        const quill = document.querySelector(".ql-editor");
                        const editor = quill && quill.__reactQuillRef?.getEditor();
                        const range = editor.getSelection();
                        editor.insertEmbed(range.index, "image", imageUrl);
                    } else {
                        throw new Error("图片上传失败，服务器返回错误！");
                    }
                } catch (error) {
                    console.error("图片上传失败：", error);
                    alert("图片上传失败，请重试！");
                } finally {
                    setUploading(false); // 无论成功还是失败，上传结束
                }
            }
        };

        input.click();
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>富文本编辑器</h2>
            <ReactQuill
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
                placeholder="在这里输入内容..."
            />
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleSave}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                    disabled={uploading} // 禁用保存按钮
                >
                    保存内容
                </button>
                {uploading && <p style={{ color: "red" }}>图片上传中，请稍候...</p>}
            </div>
            <div
                style={{
                    marginTop: "20px",
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    borderRadius: "5px",
                }}
            >
                <h3>实时 HTML 内容：</h3>
                <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        backgroundColor: "white",
                        borderRadius: "4px",
                    }}
                />
            </div>
        </div>
    );
};

export default RichTextEditor;
