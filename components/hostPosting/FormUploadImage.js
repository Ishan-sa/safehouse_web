import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { storage } from "../../firebase"
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import AppText from '../D3Components/AppText/AppText';
import Button from '../D3Components/Button/Button';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import image from '../../pages/image';

export default function FormUploadImage({ formData, setFormData }) {
  const [attachment, setAttachment] = useState()
  const [file, setFile] = useState("")
  const imageListRef = ref(storage, "images/")

  // const onFileChange = (e) => {
  //   setFile(e.target.files[0]);
  //   const {
  //     target: { files },
  //   } = e;
  //   const theFile = files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = (finishedEvent) => {
  //     const { currentTarget: { result } } = finishedEvent
  //     setAttachment(result);
  //   }
  //   reader.readAsDataURL(theFile)
  // }
  const [imgsSrc, setImgsSrc] = useState([]);
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    const {
      target: { files },
    } = e;
    for (const file of e.target.files) {
      const reader = new FileReader();
      reader.onload = (finishedEvent) => {
        setImgsSrc((imgs) => [...imgs, reader.result]);
        const { currentTarget: { result } } = finishedEvent
        setAttachment(result);
      };
      reader.readAsDataURL(file)
      const imageRef = ref(storage, `images/${file.name + uuidv4()}`)
      uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          if (formData.image[0] === "") {
            setFormData({ ...formData, image: [url] })
            return
          } else if (formData.image[0] !== "") {
            setFormData({ ...formData, image: [...formData.image, url] })
            return
          }
        })
      })
      reader.onerror = () => {
        console.log(reader.error);
      };
    }
  };

  const onClearAttachment = () => {
    setImgsSrc(null)
    return setFormData({ ...formData, image: [] })
  }


  return (
    <div>
      <p className='text-xl text-[#f5f5f5] pb-4'>Let's add some photos of your place.</p>
      <div>
        <div className='r-box flex flex-row gap-4 bg-[#f5f5f5] px-4 py-4 justify-start items-center rounded-md'>
          <input type="file" name="myImage" onChange={onFileChange} />
          {/* <img src={attachment} /> */}
        </div>
        <div className='flex flex- row mt-4 gap-5'>
          {/* <Button
            onBtnClick={onUpload}
            txt="File Upload"
            backgroundColor='grey'
            borderRadius='5px'
            boxShadow='0'
            hoverColor=''
            endIcon={<DriveFolderUploadIcon />}
          /> */}
          <Button
            onBtnClick={onClearAttachment}
            txt="Clear"
            backgroundColor='grey'
            borderRadius='5px'
            boxShadow='0'
            hoverColor=''
            endIcon={<ClearAllIcon />}
          />
        </div>

        <div className='flex flex-col gap-4 mt-4'>
          {/* <div className='r-box flex flex-row gap-4 bg-[#f5f5f5] px-4 py-4 justify-start items-center rounded-md'>
            <DriveFolderUploadIcon />
            <AppText
              txt="Choose from Device"
              fontSize='18px'
            />
          </div> */}
          <div className='r-box flex flex-row gap-4 bg-[#f5f5f5] px-4 py-4 justify-start items-center rounded-md'>
            <AddAPhotoIcon />
            <AppText
              txt="Take photos now"
              fontSize='18px'
            />
          </div>
        </div>
        <div>
          {imgsSrc?.map((link) => (
            <img key={link} src={link} />
          ))}
        </div>
      </div>
    </div>
  )
}