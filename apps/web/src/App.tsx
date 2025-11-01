import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@nouvelle/ui';

export function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tailwind Test</CardTitle>
          <CardDescription>Testing if Tailwind CSS is working</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-500 text-white rounded-lg">
            Blue background - Tailwind utility class
          </div>
          <div className="p-4 bg-primary text-primary-foreground rounded-lg">
            Primary color - Design system token
          </div>
          <Button>Test Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </CardContent>
      </Card>
    </div>
  );
}
