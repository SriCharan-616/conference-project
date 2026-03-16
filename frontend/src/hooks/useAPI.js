import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

// ==================== CONFERENCES ====================

export const useConferences = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ["conferences", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        ...filters,
      });
      const response = await axiosClient.get(`/conferences/?${params}`);
      return response.data;
    },
  });
};

export const useConference = (id) => {
  return useQuery({
    queryKey: ["conference", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/conferences/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateConference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosClient.post("/conferences/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conferences"] });
    },
  });
};

export const useUpdateConference = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosClient.put(`/conferences/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conferences"] });
      queryClient.invalidateQueries({ queryKey: ["conference", id] });
    },
  });
};

export const useDeleteConference = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axiosClient.delete(`/conferences/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conferences"] });
    },
  });
};

// ==================== SESSIONS ====================

export const useSessionsByConference = (conferenceId) => {
  return useQuery({
    queryKey: ["sessions", conferenceId],
    queryFn: async () => {
      const response = await axiosClient.get(
        `/conferences/${conferenceId}/sessions/`
      );
      return response.data;
    },
    enabled: !!conferenceId,
  });
};

// ==================== PAPERS ====================

export const usePapers = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ["papers", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        ...filters,
      });
      const response = await axiosClient.get(`/papers/?${params}`);
      return response.data;
    },
  });
};

export const useMyPapers = () => {
  return useQuery({
    queryKey: ["myPapers"],
    queryFn: async () => {
      const response = await axiosClient.get("/papers/mine/");
      return response.data;
    },
  });
};

export const usePaper = (id) => {
  return useQuery({
    queryKey: ["paper", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/papers/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useSubmitPaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("abstract", data.abstract);
      formData.append("conference", data.conference);
      formData.append("file", data.file);

      return axiosClient.post("/papers/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPapers"] });
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    },
  });
};

export const useUpdatePaperStatus = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosClient.patch(`/papers/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      queryClient.invalidateQueries({ queryKey: ["paper", id] });
      queryClient.invalidateQueries({ queryKey: ["myPapers"] });
    },
  });
};

// ==================== REGISTRATIONS ====================

export const useRegistrations = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ["registrations", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        ...filters,
      });
      const response = await axiosClient.get(`/registrations/?${params}`);
      return response.data;
    },
  });
};

export const useMyRegistrations = () => {
  return useQuery({
    queryKey: ["myRegistrations"],
    queryFn: async () => {
      const response = await axiosClient.get("/registrations/mine/");
      return response.data;
    },
  });
};

export const useRegistration = (id) => {
  return useQuery({
    queryKey: ["registration", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/registrations/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useRegisterForConference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosClient.post("/registrations/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
};

// ==================== PAYMENTS ====================

export const usePayments = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ["payments", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        ...filters,
      });
      const response = await axiosClient.get(`/payments/?${params}`);
      return response.data;
    },
  });
};

export const usePayment = (id) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/payments/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosClient.post("/payments/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
};

// ==================== USERS ====================

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/users/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUsers = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ["users", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        ...filters,
      });
      const response = await axiosClient.get(`/users/?${params}`);
      return response.data;
    },
  });
};

export const useUpdateUser = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosClient.put(`/users/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
};