import { CreateCircle } from 'app/features/circles/create/modal'
import { useRouter } from 'expo-router'

export default function CreateCircleModal() {
  const router = useRouter()
  return <CreateCircle onCancel={() => router.back()} />
}
