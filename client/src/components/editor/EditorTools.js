import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"

// functions
import { uploadImage } from "../../functions/aws"

const uploadImageByUrl = (event) => {
    const link = new Promise((resolve, reject) => {
        try {
            resolve(event)
        } catch (error) {
            reject(error)
        }
    })

    return link.then((url) => {
        return {
            success: 1,
            file: { url },
        }
    })
}

const uploadImageByFile = (event) => {
    return uploadImage(event).then((url) => {
        if (url) {
            return {
                success: 1,
                file: { url },
            }
        }
    })
}

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile,
            },
        },
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type heading...",
            levels: [2, 3],
            defaultLevel: 2,
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode,
}
