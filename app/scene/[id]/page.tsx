import { SceneView } from '@/components/scene/SceneView';

interface ScenePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScenePage({ params }: ScenePageProps) {
  const { id } = await params;
  return <SceneView sceneId={id} />;
}
