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
    SourceEditing
} from 'ckeditor5';

export default class Editor extends DecoupledEditor {

    public static override builtinPlugins = [
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
        SourceEditing
        
    ];

    public static override defaultConfig = {
        language: 'es',
        licenseKey: 'GPL',
        toolbar: {
            items: [
                'heading',
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
                'sourceEditing'

            ]
        },

        image: {
            toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side'
            ]
        },

        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties'
            ]
        }
    };
}