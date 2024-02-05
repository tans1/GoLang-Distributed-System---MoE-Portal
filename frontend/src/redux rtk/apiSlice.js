import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const distributedSystemApi = createApi({
  reducerPath: "distributedSystemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.5.196.160:8080"
  }),
  endpoints: (builder) => ({
    getResult: builder.query({
      query: (id) => {
        return {
          url: `/result?admissionNumber=${id}`,
          method: "GET"
        };
      }
    }),
    createPetition: builder.mutation({
      query(body) {
        return {
          url: `/createPetition?tag=petition`,
          method: "POST",
          body: body
        };
      }
    }),
    signPetition: builder.mutation({
      query(body) {
        return {
          url: `/signPetition?tag=petition`,
          method: "POST",
          body: body
        };
      }
    }),
    registerUser: builder.mutation({
      query(body) {
        return {
          url: `/register`,
          method: "POST",
          body: body
        };
      }
    }),
    loginUser: builder.mutation({
      query(body) {
        return {
          url: `/login`,
          method: "POST",
          body: body
        };
      }
    }),
    uploadResult: builder.mutation({
      query(body) {
        const token = localStorage.getItem("token");
        return {
          url: `/upload`,
          method: "POST",
          body: { ...body, token: token }
        };
      }
    }),

    getAllPetitions: builder.query({
      query: () => {
        return {
          url: `/petitions?tag=petition`,
          method: "GET"
        };
      }
    }),
    getAllSignatories: builder.query({
      query: (title) => {
        return {
          url: `/signatories?tag=petition&PetitionName="${title}"`,
          method: "GET"
        };
      }
    })
  })
});

export const {
  useLazyGetResultQuery,
  useCreatePetitionMutation,
  useUploadResultMutation,
  useGetAllPetitionsQuery,
  useSignPetitionMutation,
  useGetAllSignatoriesQuery,
  useLoginUserMutation,
  useRegisterUserMutation
} = distributedSystemApi;
