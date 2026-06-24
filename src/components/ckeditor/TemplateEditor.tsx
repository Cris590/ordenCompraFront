import 'ckeditor5/ckeditor5.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useRef } from 'react';
import Editor from './editor';
// import { ClassicEditor } from 'ckeditor5';
import {
    DecoupledEditor,
    Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Link,
    List,
    ListProperties,
    TodoList,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableCellProperties,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Base64UploadAdapter,
    SourceEditing,
    ClassicEditor,
    GeneralHtmlSupport
} from 'ckeditor5';
import { Chip } from '@mui/material';

interface Props {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    tags?: string[];
}

export default function TemplateEditor({
    value,
    onChange,
    readOnly = false,
    tags = []
}: Props) {

    const toolbarRef = useRef<HTMLDivElement>(null);
    const builtinPlugins = [
        Alignment,
        Autoformat,
        Base64UploadAdapter,
        BlockQuote,
        Bold,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Heading,
        Image,
        ImageCaption,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        ListProperties,
        Mention,
        Paragraph,
        PasteFromOffice,
        Strikethrough,
        Table,
        TableCellProperties,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
        SourceEditing,
        GeneralHtmlSupport

    ];

    return (
        <>
            <div className='flex flex-wrap gap-2 my-3 p-3 bg-gray-50 border rounded'>
                {tags.map((tag)=><Chip className='mx-1' color="primary" variant="outlined"  label={tag}/>)}
            </div>
                 
            <div className="bg-gray-200 p-8">
                
                <div
                    className="mx-auto bg-white shadow-lg"
                    style={{
                        width: '816px',
                        minHeight: '528px'
                    }}
                >

                    <CKEditor
                        // editor={Editor}
                        editor={ClassicEditor}
                        config={{
                            licenseKey: 'GPL',
                            plugins: builtinPlugins,
                            toolbar: ['heading',
                                '|',

                                'fontSize',
                                'fontFamily',

                                '|',

                                'fontColor',
                                'fontBackgroundColor',

                                '|',

                                'bold',
                                'italic',
                                'underline',
                                'strikethrough',

                                '|',

                                'alignment',

                                '|',

                                'numberedList',
                                'bulletedList',

                                '|',

                                'outdent',
                                'indent',

                                '|',

                                'todoList',
                                'link',
                                'blockQuote',

                                '|',

                                'imageUpload',
                                'insertTable',

                                '|',

                                'undo',
                                'redo',
                                '|',
                                'sourceEditing'],
                            htmlSupport: {
                                allow: [
                                    {
                                        name: /.*/,
                                        attributes: true,
                                        classes: true,
                                        styles: true
                                    }
                                ]
                            },
                            mention: {
                                feeds: [
                                    {
                                        marker: '@',
                                        feed: tags.map((tag:string)=>'@'+tag),
                                        minimumCharacters: 0
                                    }
                                ]
                            }
                        }}
                        data={value}
                        disabled={readOnly}
                        onReady={(editor: any) => {

                            if (toolbarRef.current) {

                                toolbarRef.current.appendChild(
                                    editor.ui.view.toolbar.element
                                );

                            }

                        }}
                        onChange={(_, editor) => {

                            onChange(
                                editor.getData()
                            );

                        }}
                    />
                </div>

            </div>
        </>
    );
}