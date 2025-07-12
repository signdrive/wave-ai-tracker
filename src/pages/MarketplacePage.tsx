import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, Star, MapPin, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Mock data - in real app this would come from Supabase
  const listings = [
    {
      id: '1',
      title: '9\'0" Longboard - Classic Log',
      brand: 'Stewart',
      model: 'Classic Log',
      price: 1200,
      condition: 'excellent',
      category: 'surfboard',
      location: 'Santa Monica, CA',
      images: ['/placeholder.svg'],
      description: 'Perfect for beginners and small waves. Classic single fin setup.',
      seller: { name: 'Mike S.', rating: 4.9 }
    },
    {
      id: '2',
      title: '4/3 Wetsuit - O\'Neill Psycho Tech',
      brand: 'O\'Neill',
      model: 'Psycho Tech',
      price: 180,
      condition: 'good',
      category: 'wetsuit',
      location: 'San Diego, CA',
      images: ['/placeholder.svg'],
      description: 'Size ML, great for cold water surfing.',
      seller: { name: 'Sarah L.', rating: 5.0 }
    },
    {
      id: '3',
      title: 'FCS II Twin Fins',
      brand: 'FCS',
      model: 'Twin Set',
      price: 45,
      condition: 'new',
      category: 'fins',
      location: 'Huntington Beach, CA',
      images: ['/placeholder.svg'],
      description: 'Brand new twin fin set, perfect for smaller waves.',
      seller: { name: 'Dave K.', rating: 4.7 }
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'surfboard', label: 'Surfboards' },
    { value: 'wetsuit', label: 'Wetsuits' },
    { value: 'fins', label: 'Fins' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || listing.condition === selectedCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'excellent': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Surf Gear Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Buy and sell surf equipment with the community
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-ocean hover:bg-ocean-dark mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              List Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>List Your Surf Gear</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="e.g., 9'0 Longboard" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surfboard">Surfboard</SelectItem>
                      <SelectItem value="wetsuit">Wetsuit</SelectItem>
                      <SelectItem value="fins">Fins</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="e.g., Stewart" />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="1200" />
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your item..." rows={3} />
              </div>
              
              <Button type="submit" className="w-full bg-ocean hover:bg-ocean-dark">
                List Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map(condition => (
              <SelectItem key={condition.value} value={condition.value}>
                {condition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:text-red-500"
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Badge className={`absolute top-2 left-2 ${getConditionColor(listing.condition)}`}>
                {listing.condition}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ${listing.price}
                </span>
                <Badge variant="outline">{listing.category}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {listing.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                  {listing.seller.rating}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-ocean hover:bg-ocean-dark">
                  Contact Seller
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;