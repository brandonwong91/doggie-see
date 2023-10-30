"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

interface BreedData {
  name: string;
  id: string;
  bred_for: string | null;
  breed_group: string | null;
  height: {
    metric: string;
    imperial: string;
  };
  weight: {
    metric: string;
    imperial: string;
  };
  temperament: string;
  life_span: string;
  reference_image_id: string | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const getKey = (pageIndex: number, previousPageData: any[]) => {
  if (previousPageData && !previousPageData.length) return null; // Reached the end
  return `https://api.thedogapi.com/v1/breeds?limit=10&page=${pageIndex + 1}`;
};

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const { data } = useSWR(
    debouncedSearchInput !== ""
      ? `https://api.thedogapi.com/v1/breeds/search?q=${searchInput}`
      : `https://api.thedogapi.com/v1/breeds?limit=10&page=0`,
    fetcher
  );
  const { data: paginatedData, setSize } = useSWRInfinite(getKey, fetcher);
  // handleOnChange
  const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSize(1);
  };

  useEffect(() => {
    // Set a 1-second debounce timer
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 1000);

    // Clear the previous timer when the input changes again
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    // Set up an event listener for scrolling to trigger loading more data
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setSize((prevSize) => prevSize + 1); // Load the next page when scrolling to the bottom
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4">
      <Input
        placeholder="Search breed..."
        value={searchInput}
        onChange={handleOnSearch}
      />
      {!data && (
        <Card className="w-96">
          <CardHeader>
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Separator />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </CardContent>
        </Card>
      )}
      {data?.map(
        ({
          name,
          id,
          bred_for,
          breed_group,
          height,
          weight,
          temperament,
          life_span,
          reference_image_id,
        }: BreedData) => {
          return (
            <Card key={id} className="w-96">
              {/* <Image src={}/> */}
              <CardHeader>
                <CardTitle className="flex gap-x-2 items-center justify-between">
                  {name}{" "}
                  <Badge className="flex gap-x-2">
                    {breed_group && (
                      <p className="italic text-gray-400">{breed_group}</p>
                    )}
                    {bred_for}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  {temperament?.split(",").map((t) => {
                    return (
                      <Badge key={t} variant={"secondary"}>
                        {t}
                      </Badge>
                    );
                  })}
                </div>
                <Separator />
                <div className="grid grid-cols-3">
                  <p className="text-sm">{`${life_span}`}</p>
                  <p className="text-sm">{`${height?.metric} cm`}</p>
                  <p className="text-sm">{`${weight?.metric} kg`}</p>
                </div>
              </CardContent>
            </Card>
          );
        }
      )}
      {searchInput === "" &&
        paginatedData &&
        paginatedData.length > 0 &&
        paginatedData.map((page, pageIndex) => (
          <div key={pageIndex} className="flex flex-col items-center gap-4">
            {page.map(
              ({
                name,
                id,
                bred_for,
                breed_group,
                height,
                weight,
                temperament,
                life_span,
                reference_image_id,
              }: BreedData) => (
                // Render data from paginated pages here
                <Card key={id} className="w-96">
                  {/* <Image src={}/> */}
                  <CardHeader>
                    <CardTitle className="flex gap-x-2 items-center justify-between">
                      {name}{" "}
                      <Badge className="flex gap-x-2">
                        {breed_group && (
                          <p className="italic text-gray-400">{breed_group}</p>
                        )}
                        {bred_for}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      {temperament?.split(",").map((t) => {
                        return (
                          <Badge key={t} variant={"secondary"}>
                            {t}
                          </Badge>
                        );
                      })}
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3">
                      <p className="text-sm">{`${life_span}`}</p>
                      <p className="text-sm">{`${height?.metric} cm`}</p>
                      <p className="text-sm">{`${weight?.metric} kg`}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        ))}
    </main>
  );
}
