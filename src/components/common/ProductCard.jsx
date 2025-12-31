import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const ProductCard = React.memo(({ product }) => {
  const cardClasses = "group hover:shadow-xl transition-all duration-300 h-full flex flex-col border-2 hover:border-purple-900";

  return (
    <Card className={cardClasses}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">
            {product.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-grow">
        <p className="text-gray-700 flex-grow font-medium">
          {product.short_description}
        </p>
        
        {product.primary_benefit && (
          <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-600">
            <p className="text-sm font-semibold text-gray-900">
              {product.primary_benefit}
            </p>
          </div>
        )}

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} className="bg-purple-100 text-purple-900 hover:bg-purple-200 text-xs font-semibold">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {product.demo_url && (
          <div className="pt-4">
            <a 
              href={product.demo_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                Try the Product
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;