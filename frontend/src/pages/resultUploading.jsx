import React from "react";
import Navbar from "../components/navbar";
import { useForm, useFieldArray } from "react-hook-form";
import "../styles/resultUpload.css";
import { useUploadResultMutation } from "../redux rtk/apiSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResultUploading() {
  const [uploadResult, { error: uploadResultError }] =
    useUploadResultMutation();
  const { register, control, handleSubmit } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: "uploadedResult"
  });
  const onSubmit = async (data) => {
    const payload = {
      Latitude: 12.5,
      Longitude: 10.4,
      Data: data.uploadedResult.map((result) => {
        return {
          ...result,
          Maths: parseFloat(result.Maths),
          English: parseFloat(result.English),
          Physics: parseFloat(result.Physics),
          Chemistry: parseFloat(result.Chemistry),
          Biology: parseFloat(result.Biology),
          Aptitude: parseFloat(result.Aptitude),
          Age: parseFloat(result.Age)

        }
      })
    };
    await uploadResult(payload)
      .unwrap()
      .then((res) => {
        toast.success('Successfully uploaded!!!', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // make the navigation after 2 seconds
        setTimeout(() => {
          window.location.href = '/result';
        }, 2000);
        // window.location('/result');

      })
      .catch((err) => {
        toast.error('Failed to upload', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      <div className="natural-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <table border="1">
            <thead>
              <tr>
                <th className="table-column-very-small">#</th>
                <th className="table-column-large">Name</th>
                <th className="table-column-small">Age</th>
                <th className="table-column-small">Sex</th>
                <th className="table-column-small">Admission Number</th>
                <th className="table-column-large">Stream</th>
                <th className="table-column-small">Maths</th>
                <th className="table-column-small">English</th>
                <th className="table-column-small">Physics</th>
                <th className="table-column-small">Chemistry</th>
                <th className="table-column-small">Biology</th>
                <th className="table-column-small">Aptitude</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input {...register(`uploadedResult.${index}.Name`)} />
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.Age`)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input {...register(`uploadedResult.${index}.Sex`)} />
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.AdmissionNumber`)}
                    />
                  </td>
                  <td>
                    <select {...register(`uploadedResult.${index}.Stream`)}>
                      <option value="Natural">Natural</option>
                      <option value="Social">Social</option>
                    </select>
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.Maths`)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.English`)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.Physics`)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.Chemistry`)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.Biology`)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      {...register(`uploadedResult.${index}.Aptitude`)}
                      type="number"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="submit-append-container">
            <div>
              <button
                type="button"
                onClick={() =>
                  append({
                    Name: "",
                    Age: 0,
                    Sex: "",
                    AdmissionNumber: "",
                    Stream: "Natural",
                    Maths: 0,
                    English: 0,
                    Physics: 0,
                    Chemistry: 0,
                    Biology: 0,
                    Aptitude: 0
                  })
                }
                className="append">
                +
              </button>
            </div>
            <div>
              <button type="submit">submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
