"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "lucide-react";
import FallbackImage from "@/components/FallbackImage";
import Image from "next/image";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
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
  const [toggleStates, setToggleStates] = useState<{ [key: string]: string }>({
    Name: "CaretSort",
    Height: "CaretSort",
    Life_span: "CaretSort",
  });
  const { data, isLoading } = useSWR(
    debouncedSearchInput !== ""
      ? `https://api.thedogapi.com/v1/breeds/search?q=${searchInput}`
      : `https://api.thedogapi.com/v1/breeds?limit=10&page=0`,
    fetcher
  );
  const { data: paginatedData, setSize } = useSWRInfinite(getKey, fetcher);

  const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSize(1);
  };

  useEffect(() => {
    // Set a 1-second debounce timer
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
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
  }, [setSize]);

  const toggleItems = ["Name", "Height", "Life_span"];

  const handleToggleClick = (item: string) => {
    setToggleStates((prevState) => {
      // Reset all items to CaretSort
      const updatedStates: { [key: string]: string } = {};
      for (const toggleItem of toggleItems) {
        updatedStates[toggleItem] = "CaretSort";
      }
      // Set the clicked item to the desired state
      updatedStates[item] =
        prevState[item] === "CaretSort"
          ? "CaretUp"
          : prevState[item] === "CaretUp"
          ? "CaretDown"
          : "CaretSort";
      return updatedStates;
    });
  };

  const handleResetClick = () => {
    setToggleStates({
      Name: "CaretSort",
      Height: "CaretSort",
      Life_span: "CaretSort",
    });
  };

  const handleClearSearchInput = () => setSearchInput("");

  const areAllStatesCaretSort = Object.values(toggleStates).every(
    (state) => state === "CaretSort"
  );

  function getActiveToggle(toggleStates: { [key: string]: string }) {
    for (const toggle in toggleStates) {
      if (toggleStates[toggle] !== "CaretSort") {
        return { toggle, toggleDirection: toggleStates[toggle] };
      }
    }
    return null;
  }

  const activeToggleResult = getActiveToggle(toggleStates);
  const { toggle: activeToggle, toggleDirection } = activeToggleResult || {
    toggle: "",
    toggleDirection: "",
  };

  function compareItems(a: BreedData, b: BreedData): number {
    const calculateAverage = (range: string) => {
      return (
        range.split(" - ").reduce((sum, value) => sum + Number(value), 0) / 2
      );
    };

    const averageLifeSpanA =
      activeToggle === "Life_span" ? calculateAverage(a.life_span) : null;

    const averageLifeSpanB =
      activeToggle === "Life_span" ? calculateAverage(b.life_span) : null;

    const aVal =
      activeToggle === "Height"
        ? calculateAverage(a.height.metric)
        : averageLifeSpanA || (a as any)[activeToggle.toLowerCase()];

    const bVal =
      activeToggle === "Height"
        ? calculateAverage(b.height.metric)
        : averageLifeSpanB || (b as any)[activeToggle.toLowerCase()];

    if (toggleDirection === "CaretSort") return 0;

    if (toggleDirection === "CaretUp") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  }

  const sortedData =
    searchInput === "" && paginatedData
      ? paginatedData.flat().slice().sort(compareItems)
      : data
      ? data.slice().sort(compareItems)
      : [];

  return (
    <main className="flex min-h-screen flex-col items-center p-12 gap-4">
      <HoverCard>
        <HoverCardTrigger className="text-2xl font-bold hover:underline">
          Doggie See
        </HoverCardTrigger>
        <HoverCardContent className="h-fit z-50 bg-white p-2 border-2 rounded-md text-xs">
          <p>Built with: NextJS, Vercel, shadcn/ui</p>
          <p className="italic">Built by: Brandon Wong</p>
        </HoverCardContent>
      </HoverCard>
      <div className="flex flex-col gap-4 w-full items-center sticky top-10 backdrop-blur-lg">
        <div className="w-full max-w-2xl flex justify-between group focus:ring-1 outline outline-slate-100 border-1 border-gray-300 py-0.5 h-10 rounded-md focus:outline-slate-600 focus-within:outline-slate-600 ">
          <Input
            placeholder="Search breed..."
            value={searchInput}
            onChange={handleOnSearch}
            className="border-0 shadow-none focus-visible:ring-0 "
          />
          {searchInput !== "" && (
            <Button variant="link" size="icon" onClick={handleClearSearchInput}>
              <XCircleIcon className="text-slate-500" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 text-sm items-center w-[400px] h-12">
          <Label htmlFor="sort by">Sort by:</Label>
          {toggleItems.map((item, index) => (
            <Toggle
              key={index}
              variant="outline"
              onClick={() => handleToggleClick(item)}
              pressed={toggleStates[item] !== "CaretSort"}
            >
              {toggleStates[item] === "CaretSort" && <CaretSortIcon />}
              {toggleStates[item] === "CaretUp" && <CaretUpIcon />}
              {toggleStates[item] === "CaretDown" && <CaretDownIcon />}
              {item}
            </Toggle>
          ))}
          {!areAllStatesCaretSort && (
            <Button variant="link" size="icon" onClick={handleResetClick}>
              <XCircleIcon className="text-slate-500 " />
            </Button>
          )}
        </div>
      </div>
      {isLoading && (
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
      {sortedData?.map(
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
              <FallbackImage
                src={`https://cdn2.thedogapi.com/images/${reference_image_id}.jpg`}
                alt={reference_image_id ?? "error"}
                width={384}
                height={240}
              />
              <CardHeader>
                <CardTitle className="flex gap-y-2 flex-col">
                  {name}
                  {(breed_group || bred_for) && (
                    <Badge className="flex gap-x-2 w-fit">
                      {<p className="italic text-gray-400">{breed_group}</p>}
                      {bred_for}
                    </Badge>
                  )}
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
      {sortedData.length === 0 && (
        <Card className="w-96 h-fit">
          <Image
            src={"/puppy-not-found.jpg"}
            alt="no"
            width={384}
            height={240}
            className="rounded-t-lg"
          />
          <CardHeader>
            <p>Doggie not found...</p>
            <Button onClick={handleClearSearchInput}>Clear search</Button>
          </CardHeader>
        </Card>
      )}
    </main>
  );
}
