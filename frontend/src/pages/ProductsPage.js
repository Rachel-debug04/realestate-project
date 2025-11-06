import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productsAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingDown, Clock, CheckCircle } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompare = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : prev.length < 3 ? [...prev, productId] : prev
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C81]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4" style={{ fontFamily: 'Space Grotesk' }} data-testid="products-title">
            Mortgage Products
          </h1>
          <p className="text-lg text-[#667085]">
            Compare rates and find the perfect loan for your needs
          </p>
        </div>

        {selectedProducts.length > 0 && (
          <div className="mb-8 flex items-center justify-between bg-[#E8F4F8] p-4 rounded-xl">
            <span className="text-[#0F4C81] font-medium">{selectedProducts.length} products selected for comparison</span>
            <Button onClick={() => navigate(`/products/compare?ids=${selectedProducts.join(',')}`)} className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full" data-testid="compare-btn">
              Compare Selected
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <Card key={product.id} className={`border-[#E5E7EB] card-hover ${selectedProducts.includes(product.id) ? 'ring-2 ring-[#0F4C81]' : ''}`} data-testid={`product-${product.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle style={{ fontFamily: 'Space Grotesk' }}>{product.lender_name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge className="bg-[#E8F4F8] text-[#0F4C81] capitalize">{product.loan_type}</Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#0F4C81]" style={{ fontFamily: 'Space Grotesk' }}>{formatPercent(product.rate)}</p>
                    <p className="text-sm text-[#667085]">APR {formatPercent(product.apr)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#667085]">Term</p>
                    <p className="font-semibold flex items-center"><Clock className="h-4 w-4 mr-1 text-[#0F4C81]" />{product.term / 12} years</p>
                  </div>
                  <div>
                    <p className="text-[#667085]">Fees</p>
                    <p className="font-semibold flex items-center"><TrendingDown className="h-4 w-4 mr-1 text-[#0F4C81]" />{formatCurrency(product.fees)}</p>
                  </div>
                  <div>
                    <p className="text-[#667085]">Min Credit Score</p>
                    <p className="font-semibold">{product.min_credit_score}</p>
                  </div>
                  <div>
                    <p className="text-[#667085]">Min Down Payment</p>
                    <p className="font-semibold">{formatPercent(product.min_down_payment * 100)}</p>
                  </div>
                </div>

                <div className="border-t border-[#E5E7EB] pt-4">
                  <p className="text-sm font-medium mb-2">Features:</p>
                  <ul className="space-y-1">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-[#667085] flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-[#10B981]" />{feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={() => toggleCompare(product.id)} variant="outline" className="flex-1 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white" data-testid={`select-product-${product.id}`}>
                    {selectedProducts.includes(product.id) ? 'Remove' : 'Compare'}
                  </Button>
                  <Button onClick={() => navigate('/application', { state: { product } })} className="flex-1 bg-[#0F4C81] hover:bg-[#0A3A61] text-white" data-testid={`apply-product-${product.id}`}>
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}