import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/api-client";

export const useImages = (search?: string) => {
    return useInfiniteQuery({
        queryKey: ["images", search],
        queryFn: async ({ pageParam = 1 }) => {
            return apiClient.getImages({
                page: pageParam,
                limit: 10,
                search,
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};
