import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const distributedSystemApi = createApi({
  reducerPath: "DSApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  endpoints: (builder) => ({
    getResult: builder.query({
      query: (id) => {
        return {
          url: `/result?admissionNumber=${id}`,
          method: "GET"
          // body: { admissionNumber: id }
        };
      }
    })
  })
});

export const { useLazyGetResultQuery } = distributedSystemApi;
