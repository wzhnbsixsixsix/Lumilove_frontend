import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TrendingCharacter {
  id: number
  name: string
  occupation: string
  rank: number
  imageSrc: string
}

export default function TrendingList({ characters }: { characters: TrendingCharacter[] }) {
  return (
    <div className="bg-[#1a0a24] rounded-xl p-5 border border-[#3a1a44]">
      <Tabs defaultValue="hot">
        <TabsList className="grid grid-cols-2 mb-4 bg-[#2a1a34]">
          <TabsTrigger value="hot" className="data-[state=active]:bg-pink-500">
            🔥 Hot
          </TabsTrigger>
          <TabsTrigger value="trending" className="data-[state=active]:bg-pink-500">
            🟣 Trending
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hot" className="space-y-3 mt-0">
          {characters.map((character) => (
            <Link href={`/chat/${character.id}`} key={character.id}>
              <div className="flex items-center p-2 rounded-lg hover:bg-[#2a1a34] transition-colors">
                <div className="relative mr-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={character.imageSrc || "/placeholder.svg"}
                      alt={character.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  {character.rank <= 3 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                      {character.rank}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{character.name}</h4>
                  <p className="text-xs text-gray-400">{character.occupation}</p>
                </div>
                <div className="text-sm text-gray-400">#{character.rank}</div>
              </div>
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="trending" className="space-y-3 mt-0">
          {characters
            .slice()
            .reverse()
            .map((character, index) => (
              <Link href={`/chat/${character.id}`} key={character.id}>
                <div className="flex items-center p-2 rounded-lg hover:bg-[#2a1a34] transition-colors">
                  <div className="relative mr-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={character.imageSrc || "/placeholder.svg"}
                        alt={character.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{character.name}</h4>
                    <p className="text-xs text-gray-400">{character.occupation}</p>
                  </div>
                  <div className="text-sm text-gray-400">#{5 - index}</div>
                </div>
              </Link>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
