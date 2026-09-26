'use client';

import { useState } from 'react';
import { Boxes, ListChecks, ShoppingBag, Tags, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUsage } from '@/hooks/use-usage';
import { UsageBanner } from './usage-banner';
import { PricingModal } from './pricing-modal';
import { ShopeeMode } from './shopee-mode';
import { MercadoLivreMode } from './ml-mode';
import { MlFullMode } from './ml-full-mode';
import { TiktokMode } from './tiktok-mode';
import { PickingListMode } from './picking-list-mode';

export function ConverterApp() {
  const { usage, refresh } = useUsage();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<'limit' | 'upgrade'>('upgrade');
  const [resetAt, setResetAt] = useState<string | null>(null);

  function handleLimitExceeded(reset: string) {
    setResetAt(reset);
    setModalReason('limit');
    setModalOpen(true);
    refresh();
  }

  function handleUpgradeClick() {
    setModalReason('upgrade');
    setResetAt(null);
    setModalOpen(true);
  }

  return (
    <div>
      <UsageBanner usage={usage} onUpgradeClick={handleUpgradeClick} />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="shopee">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5">
              <TabsTrigger value="shopee" className="gap-1.5 py-2">
                <ShoppingBag className="h-4 w-4" /> Shopee
              </TabsTrigger>
              <TabsTrigger value="ml" className="gap-1.5 py-2">
                <Tags className="h-4 w-4" /> Mercado Livre
              </TabsTrigger>
              <TabsTrigger value="ml-full" className="gap-1.5 py-2">
                <Boxes className="h-4 w-4" /> Full ML
              </TabsTrigger>
              <TabsTrigger value="tiktok" className="gap-1.5 py-2">
                <Truck className="h-4 w-4" /> TikTok Shop
              </TabsTrigger>
              <TabsTrigger value="picking-list" className="gap-1.5 py-2">
                <ListChecks className="h-4 w-4" /> Separação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shopee" className="pt-6">
              <ShopeeMode onLimitExceeded={handleLimitExceeded} onConverted={refresh} />
            </TabsContent>
            <TabsContent value="ml" className="pt-6">
              <MercadoLivreMode onLimitExceeded={handleLimitExceeded} onConverted={refresh} />
            </TabsContent>
            <TabsContent value="ml-full" className="pt-6">
              <MlFullMode onLimitExceeded={handleLimitExceeded} onConverted={refresh} />
            </TabsContent>
            <TabsContent value="tiktok" className="pt-6">
              <TiktokMode onLimitExceeded={handleLimitExceeded} onConverted={refresh} />
            </TabsContent>
            <TabsContent value="picking-list" className="pt-6">
              <PickingListMode onLimitExceeded={handleLimitExceeded} onConverted={refresh} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PricingModal open={modalOpen} onOpenChange={setModalOpen} resetAt={resetAt} reason={modalReason} />
    </div>
  );
}
