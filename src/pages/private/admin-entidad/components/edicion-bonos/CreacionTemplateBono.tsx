import React, { useState } from 'react'
import TemplateEditor from '../../../../../components/ckeditor/TemplateEditor';
import { Button } from '@mui/material';


interface Props {
    codEntidad: number
}

export const CreacionTemplateBono = ({ codEntidad }: Props) => {

    const [html, setHtml] = useState('');
    const handlePreview = () => {
    const previewWindow = window.open('', '_blank');

    if (!previewWindow) return;

    previewWindow.document.write(`
            <html>
            <head>
            <style>

            *{
                box-sizing:border-box;
            }

            body{
                margin:0;
                padding:30px;
                background:#f5f5f5;
                display:flex;
                justify-content:center;
            }

            .page{
                width:816px;
                min-height:1056px;
                background:white;
                box-shadow:0 0 10px rgba(0,0,0,.15);
            }

            p{
                margin:0;
            }

            h1,h2,h3,h4,h5,h6{
                margin:0;
            }

            figure{
                margin:0;
            }

            .image_resized{
                margin:0;
            }

            img{
                max-width:100%;
            }

            </style>
            </head>
            <body>
            <div class="page">
            ${html}
            </div>
            </body>
            </html>
        `);

    previewWindow.document.close();
};
  return (
    <>  
        <Button
    variant="contained"
    onClick={handlePreview}
>
    Vista previa
</Button>
        <TemplateEditor
                value={html}
                onChange={setHtml}
            />

            <hr />

            <h2>Vista previa</h2>
{/* 
            <div
                dangerouslySetInnerHTML={{
                    __html: html
                }}
            /> */}
    </>
  )
}
