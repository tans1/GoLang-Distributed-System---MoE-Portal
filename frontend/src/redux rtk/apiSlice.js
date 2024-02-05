import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const distributedSystemApi = createApi({
  reducerPath: "distributedSystemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080"
  }),
  endpoints: (builder) => ({
    getResult: builder.query({
      query: (id) => {
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/result?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}&admissionNumber=${id}`,
          method: "GET"
        };
      }
    }),
    createPetition: builder.mutation({
      query(body) {
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/createPetition?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}&tag=petition`,
          method: "POST",
          body: body
        };
      }
    }),
    signPetition: builder.mutation({
      query(body) {
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/signPetition?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}&tag=petition`,
          method: "POST",
          body: body
        };
      }
    }),
    registerUser: builder.mutation({
      query(body) {
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/register?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}`,
          method: "POST",
          body: body
        };
      }
    }),
    loginUser: builder.mutation({
      query(body) {
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/login?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}`,
          method: "POST",
          body: body
        };
      }
    }),
    uploadResult: builder.mutation({
      query(body) {
        const token = localStorage.getItem("token");
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/upload?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}`,
          method: "POST",
          body: { ...body, token: token }
        };
      }
    }),

    getAllPetitions: builder.query({
      query: () => {
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/petitions?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}&tag=petition`,
          method: "GET"
        };
      }
    }),
    getAllSignatories: builder.query({
      query: (title) => {
        const getRandomFloat = () => {
          return Math.random() * 180;
        };
        return {
          url: `/signatories?Latitude=${getRandomFloat()}&Longitude=${getRandomFloat()}&tag=petition&PetitionName="${title}"`,
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
