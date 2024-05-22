import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import NavBar from '../components/NavBar';
import { auth } from '../firebaseConfig';

const carsData = [
    {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        image: 'https://example.com/toyota-camry.jpg',
    },
    {
        id: 2,
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        image: 'https://example.com/honda-civic.jpg',
    },
    {
        id: 3,
        make: 'Ford',
        model: 'Mustang',
        year: 2021,
        image: 'https://example.com/ford-mustang.jpg',
    },
    {
        id: 4,
        make: 'Tesla',
        model: 'Model 3',
        year: 2022,
        description: 'An electric sedan with a range of up to 358 miles',
        image: 'https://example.com/tesla-model-3.jpg',
    },
];

const CarsPage: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    const userName = JSON.stringify(auth?.currentUser?.email);

    const renderCarItem = ({ item }: { item: any }) => (
        <Card style={styles.card}>
            <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
            <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>{item.make} {item.model}</Title>
                <Paragraph style={styles.cardYear}>Year: {item.year}</Paragraph>
                {item.description && <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>}
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <NavBar route={route} navigation={navigation} />
            <View style={styles.content}>
                <FlatList
                    data={carsData}
                    renderItem={renderCarItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        elevation: 4,
        marginBottom: 16,
    },
    cardImage: {
        height: 200,
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardYear: {
        fontSize: 16,
        color: '#666',
    },
    cardDescription: {
        marginTop: 8,
        fontSize: 16,
    },
});

export default CarsPage;