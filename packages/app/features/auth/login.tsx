import { View, Image } from 'react-native';
import { MotiLink } from 'solito/moti';
import { useRouter } from 'solito/navigation';

import { Typography, A, TextLink } from 'app/ui/typography';
import Button from 'app/ui/button';
import { Row } from 'app/ui/layout';

export function LoginScreen() {
    const router = useRouter();
    return (
        <View className="flex-1 justify-center bg-[#6493d9]">
            <Typography variant="h1">Login</Typography>
        </View>
    );
}
