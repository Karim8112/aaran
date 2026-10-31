import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

export const PaginationComponent = function (props: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  loading: boolean;
}) {
  const { page, setPage, total, loading } = props;

  return (
    <div className="flex! items-center! gap-4! ">
      <Button
        onClick={() => {
          setPage(page - 1);
        }}
        disabled={page == 1}
      >
        <ChevronLeft />
        previous
      </Button>
      <span>page: {page}, </span>
      {!loading ? (
        <span>
          {(page - 1) * 10 + 1} - {page * 10 < total ? page * 10 : total}
        </span>
      ) : (
        <>loading ...</>
      )}
      <Button
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={page * 10 + 1 > total}
      >
        next
        <ChevronRight />
      </Button>
    </div>
  );
};
