"use client";

import { Card, CardContent , CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, Sparkles } from "lucide-react";

interface Book {
  id: number;
  title: string;
  isOptional?: boolean;
  canReadSimultaneously?: boolean;
}

interface Category {
  id: number;
  title: string;
  description: string;
  books: Book[];
  color: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    id: 1,
    title: "Category I - Foundation",
    description: "Essential books for beginners to understand Krishna consciousness philosophy",
    color: "from-blue-600 to-purple-600",
    icon: <BookOpen className="w-5 h-5" />,
    books: [
      { id: 1, title: "On The Way to Krishna" },
      { id: 2, title: "Elevation to Krishna Consciousness" },
      { id: 3, title: "Krishna Consciousness the Matchless Gift" },
      { id: 4, title: "Krishna the Reservoir of Pleasure" },
      { id: 5, title: "Perfection of Yoga" },
      { id: 6, title: "Krishna Consciousness – The Topmost Yoga System" },
      { id: 7, title: "Beyond Birth and Death" },
      { id: 8, title: "Perfect Questions, Perfect Answers" },
      { id: 9, title: "Easy Journey to Other Planets" },
      { id: 10, title: "Raja Vidya: The King of Knowledge" },
      { id: 11, title: "Transcendental Teachings of Prahlad Maharaj" },
      { id: 12, title: "Coming Back" },
      { id: 13, title: "Message of Godhead", isOptional: true },
      { id: 14, title: "Civilization and Transcendence", isOptional: true },
      { id: 15, title: "Hare Krishna Challenge", isOptional: true },
      { id: 16, title: "Scientific Basis of Krishna Consciousness", isOptional: true },
      { id: 17, title: "Sword of Knowledge", isOptional: true },
      { id: 18, title: "Nectar of Instruction" },
      { id: 19, title: "Path of Perfection" },
      { id: 20, title: "Issues of Back To Back to Godhead Magazine" },
      { id: 21, title: "Prabhupada Lilamrita", canReadSimultaneously: true },
    ]
  },
  {
    id: 2,
    title: "Category II - Intermediate",
    description: "Advanced texts to deepen understanding after completing Category I",
    color: "from-emerald-600 to-teal-600",
    icon: <Star className="w-5 h-5" />,
    books: [
      { id: 22, title: "Introduction to Bhagvad Gita As It Is" },
      { id: 23, title: "Science of Self-Realization" },
      { id: 24, title: "Journey of Self Discovery" },
      { id: 25, title: "Life comes from Life" },
      { id: 26, title: "Nectar of Devotion (Only Part One)" },
      { id: 27, title: "Teachings of Queen Kunti" },
      { id: 28, title: "Teachings of Lord Kapila" },
      { id: 29, title: "Teachings of Lord Chaitanya" },
      { id: 30, title: "Sri Isopanishad" },
      { id: 31, title: "Few Shlokas of Bhagvad Gita Everyday" },
      { id: 32, title: "Krishna Book", canReadSimultaneously: true },
      { id: 33, title: "Srimad Bhagavatam (1st Canto)", canReadSimultaneously: true },
      { id: 34, title: "A Second Chance", canReadSimultaneously: true },
    ]
  },
  {
    id: 3,
    title: "Category III - Advanced",
    description: "Comprehensive scriptures for serious practitioners after Categories I & II",
    color: "from-amber-600 to-orange-600",
    icon: <Sparkles className="w-5 h-5" />,
    books: [
      { id: 35, title: "Bhagvad Gita As It Is" },
      { id: 36, title: "Srimad Bhagavatam (Canto By Canto)" },
      { id: 37, title: "Nectar Of Devotion (Part II And Part III)" },
      { id: 38, title: "Chaitanya Charitamrita" },
    ]
  }
];

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent leading-[1.1]">
              Suggested Reading Order
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Srila Prabhupada's books for serious spiritual advancement
            </p>
            <div className="text-gray-400 max-w-3xl mx-auto">
              <p className="mb-4">
                Systematic and regular reading of these books will help you clearly understand 
                the philosophy of Krishna consciousness and develop faith and conviction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="mb-12">
                <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${category.color} text-white mb-6 shadow-lg`}>
                  {category.icon}
                  <h2 className="text-2xl md:text-4xl font-bold">{category.title}</h2>
                </div>
                <p className="text-gray-400 text-lg md:text-xl max-w-4xl leading-relaxed mb-6">
                  {category.description}
                </p>
                {categoryIndex > 0 && (
                  <p className="text-sm md:text-base text-amber-400 font-medium bg-amber-400/10 border border-amber-400/20 px-6 py-3 rounded-xl inline-block">
                    ⚠️ Read after completing all books in Category {categoryIndex > 1 ? 'I and Category II' : 'I'}
                  </p>
                )}
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {category.books.map((book, index) => (
                  <Card key={book.id} className="bg-gray-900/70 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group backdrop-blur-md">
                    <CardHeader className="pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-mono text-gray-300 bg-gray-800/90 px-4 py-2 rounded-full border border-gray-700/50">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="flex gap-2">
                          {book.isOptional && (
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400/60 bg-yellow-400/15 text-xs font-medium">
                              Optional
                            </Badge>
                          )}
                          {book.canReadSimultaneously && (
                            <Badge variant="outline" className="text-green-400 border-green-400/60 bg-green-400/15 text-xs font-medium">
                              Simultaneous
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-gray-100 group-hover:text-white transition-colors leading-tight text-lg font-semibold">
                        {book.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                      <div className="h-2 bg-gray-800/80 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${category.color} opacity-70`}
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {categoryIndex < categories.length - 1 && (
                <div className="mt-20">
                  <div className="flex items-center justify-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-full max-w-2xl"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Notes */}
        <div className="mt-24 bg-gray-900/50 border border-gray-700/50 rounded-3xl p-10 backdrop-blur-md">
          <h3 className="text-3xl font-semibold text-gray-200 mb-8">Reading Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-10 text-gray-400">
            <div>
              <h4 className="font-semibold text-gray-300 mb-6 text-xl">Legend:</h4>
              <ul className="space-y-4 text-base">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/60 bg-yellow-400/15 text-xs font-medium">
                    Optional
                  </Badge>
                  <span>Optional reading books</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/60 bg-green-400/15 text-xs font-medium">
                    Simultaneous
                  </Badge>
                  <span>Can be read simultaneously with others</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-6 text-xl">Tips:</h4>
              <ul className="space-y-4 text-base">
                <li>• Read books in the suggested order for best understanding</li>
                <li>• Complete each category before moving to the next</li>
                <li>• Regular daily reading is more beneficial than sporadic reading</li>
                <li>• Reflect and contemplate on the teachings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}