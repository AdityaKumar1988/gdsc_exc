'use client';

import {generateEcoTip, GenerateEcoTipOutput} from '@/ai/flows/generate-eco-tip';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from '@/hooks/use-toast';
import {useToast} from '@/hooks/use-toast';
import {useEffect, useState} from 'react';
import {Textarea} from "@/components/ui/textarea";
import {Toaster} from "@/components/ui/toaster";

interface Location {
  lat: number;
  lng: number;
}

interface UserInputProps {
  onGenerateTip: (tip: GenerateEcoTipOutput | null) => void;
}

const UserInput: React.FC<UserInputProps> = ({onGenerateTip}) => {
  const [lifestyle, setLifestyle] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTip = async () => {
    setIsLoading(true);
    try {
      const ecoTip = await generateEcoTip({
        lifestyle: lifestyle,
        location: location || undefined,
      });
      onGenerateTip(ecoTip);
    } catch (error: any) {
      onGenerateTip(null);
      toast({
        title: 'Error generating eco-tip',
        description: error.message || 'Failed to generate eco-tip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast({
            title: 'Error getting geolocation',
            description: error.message || 'Failed to get geolocation. Please enter location manually.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Geolocation not supported',
        description: 'Geolocation is not supported by your browser. Please enter location manually.',
        variant: 'destructive',
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md shadow-md bg-secondary">
      <Label htmlFor="lifestyle">Lifestyle:</Label>
      <Textarea
        id="lifestyle"
        placeholder="Describe your lifestyle (e.g., diet, transportation, habits)"
        value={lifestyle}
        onChange={(e) => setLifestyle(e.target.value)}
        className="rounded-md"
      />
      {location ? (
        <div className="text-sm text-muted-foreground">
          Using your current location: Lat {location.lat}, Lng {location.lng}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Detecting location...</div>
      )}
      <Button onClick={handleGenerateTip} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-md">
        {isLoading ? 'Generating...' : 'Generate Eco-Tip'}
      </Button>
    </div>
  );
};

interface EcoTipProps {
  tip: GenerateEcoTipOutput | null;
}

const EcoTip: React.FC<EcoTipProps> = ({tip}) => {
  return (
    <>
      {tip ? (
        <Card className="w-full max-w-lg bg-card text-card-foreground shadow-md rounded-md">
          <CardHeader>
            <CardTitle>Eco-Tip</CardTitle>
            <CardDescription>Category: {tip.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{tip.tip}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-lg bg-card text-card-foreground shadow-md rounded-md">
          <CardHeader>
            <CardTitle>Eco-Tip</CardTitle>
            <CardDescription>No tip generated yet. Please provide your lifestyle details and generate.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  );
};

export default function Home() {
  const [ecoTip, setEcoTip] = useState<GenerateEcoTipOutput | null>(null);
  const {toast} = useToast();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <Toaster/>
      <h1 className="text-4xl font-bold mb-4 text-foreground">EcoTips</h1>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <UserInput onGenerateTip={setEcoTip}/>
        <div className="mt-8">
          <EcoTip tip={ecoTip}/>
        </div>
      </main>
    </div>
  );
}


