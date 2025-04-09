import {toast} from 'react-toastify'

export const successAlert = (msg)=>{
    toast.success(msg,{
        position:"top-right",
        className: "toast-black-bg",

    })
}

export const errorAlert = (msg)=>{
    toast.error(msg,{
        position:"top-right",
        style: {
            backgroundColor: "rgb(15 23 42)",
            color: "white",
          },

    })
}