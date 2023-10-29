import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  const data = [
    {
      bred_for: "Sled pulling",
      breed_group: "Mixed",
      height: {
        imperial: "23 - 26",
        metric: "58 - 66",
      },
      id: 8,
      life_span: "10 - 13 years",
      name: "Alaskan Husky",
      reference_image_id: "-HgpNnGXl",
      temperament: "Friendly, Energetic, Loyal, Gentle, Confident",
      weight: {
        imperial: "38 - 50",
        metric: "17 - 23",
      },
    },
    {
      bred_for: "Sled pulling",
      breed_group: "Working",
      height: {
        imperial: "20 - 23.5",
        metric: "51 - 60",
      },
      id: 226,
      life_span: "12 years",
      name: "Siberian Husky",
      reference_image_id: "S17ZilqNm",
      temperament: "Outgoing, Friendly, Alert, Gentle, Intelligent",
      weight: {
        imperial: "35 - 60",
        metric: "16 - 27",
      },
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4">
      <Input placeholder="Search..." />
      {data.map(
        ({
          name,
          id,
          bred_for,
          breed_group,
          height,
          weight,
          temperament,
          life_span,
        }) => {
          return (
            <Card key={id}>
              <CardHeader>
                <CardTitle className="flex gap-x-2 items-center">
                  {name} <Badge>{bred_for}</Badge>
                </CardTitle>
                <CardDescription className="flex flex-col italic">
                  {breed_group}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap w-48">
                  {temperament.split(",").map((t) => {
                    return (
                      <Badge key={t} variant={"secondary"}>
                        {t}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-sm">{`${height.metric} cm`}</p>
                <p className="text-sm">{`${weight.metric} kg`}</p>
                <p className="text-sm">{`${life_span}`}</p>
              </CardContent>
            </Card>
          );
        }
      )}
    </main>
  );
}
