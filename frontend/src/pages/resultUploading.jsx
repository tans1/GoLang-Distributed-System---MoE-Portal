import React from 'react'
import Navbar from '../components/navbar'
import { useForm,  useFieldArray } from 'react-hook-form';
import "../styles/resultUpload.css"

export default function ResultUploading() {
    const { register, control, handleSubmit } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: "data", 
  });
  const onSubmit = async (data) =>  {
    console.log(data)
  }
  return (
    <div>
      <Navbar />
      <div className='natural-form-container'>

      <form onSubmit={handleSubmit(onSubmit)}>
      <table border="1">
          <thead>
            <tr>
              <th className='table-column-very-small'>#</th>
              <th className='table-column-large'>Name</th>
              <th className='table-column-small'>Age</th>
              <th className='table-column-small'>Sex</th>
              <th className='table-column-small'>AdmissionNumber</th>
              <th className='table-column-small'>Stream</th>
              <th className='table-column-small'>Maths</th>
              <th className='table-column-small'>English</th>
              <th className='table-column-small'>Physics</th>
              <th className='table-column-small'>Chemistry</th>
              <th className='table-column-small'>Biology</th>
              <th className='table-column-small'>Aptitude</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><input {...register(`data.${index}.Name`)} /></td>
                <td><input {...register(`data.${index}.Age`)} type='number'/></td>
                <td><input {...register(`data.${index}.Sex`)} /></td>
                <td><input {...register(`data.${index}.AdmissionNumber`)} type='number' /></td>
                <td>
                    <select {...register(`data.${index}.Stream`)}>
                      <option value='Natural'>Natural</option>
                      <option value='Social'>Social</option>
                    </select>
                  </td>
                <td><input {...register(`data.${index}.Maths`)} type='number' /></td>
                <td><input {...register(`data.${index}.English`)} type='number' /></td>
                <td><input {...register(`data.${index}.Physics`)} type='number' /></td>
                <td><input {...register(`data.${index}.Chemistry`)} type='number' /></td>
                <td><input {...register(`data.${index}.Biology`)} type='number' /></td>
                <td><input {...register(`data.${index}.Aptitude`)} type='number' /></td>
              </tr>
            ))}
          </tbody>
        </table>
     <div className='submit-append-container'>
        <div>
            <button
                type="button"
                onClick={() => append({ 
                    Name : "",
                    Age : 0,
                    Sex : "",
                    AdmissionNumber : "",
                    Stream  : "Natural",
                    Maths : 0,
                    English : 0,
                    Physics : 0,
                    Chemistry : 0,
                    Biology : 0,
                    Aptitude : 0,
                })}
                className='append'
            >
                +
            </button>
            </div>
      <div><button type="submit">submit</button></div></div>
    </form>
      </div>
    </div>
  )
}
