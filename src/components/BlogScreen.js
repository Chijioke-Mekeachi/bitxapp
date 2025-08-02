import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';

export default function BlogScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('https://rpc.blurt.world', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'condenser_api.get_discussions_by_blog',
          params: [{
            tag: 'promoblurt',
            limit: 10,
          }],
        }),
      });

      const result = await response.json();
      if (result.result && result.result.length > 0) {
        const enrichedPosts = result.result.map((post) => {
          let profileImage = `https://images.blurt.world/u/${post.author}/avatar`;

          try {
            const meta = JSON.parse(post.json_metadata || '{}');
            const customImg = meta?.profile?.profile_image;
            if (customImg) {
              profileImage = customImg;
            }
          } catch (_) {}

          return {
            ...post,
            profileImage,
          };
        });

        setPosts(enrichedPosts);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPost = (post) => {
    const url = `https://blurt.blog/@${post.author}/${post.permlink}`;
    Linking.openURL(url);
  };

  const extractFirstImage = (body) => {
    const imageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/;
    const match = body.match(imageRegex);
    return match ? match[1] : null;
  };

  const stripMarkdown = (text) => {
    return text
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
      .replace(/[#*_`]/g, '') // Remove markdown symbols
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#ffcc00" />
        <Text style={styles.loadingText}>Loading blog posts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Latest Blog Posts</Text>
        {posts.map((post, index) => (
          <TouchableOpacity
            key={index}
            style={styles.postCard}
            onPress={() => openPost(post)}
          >
            <View style={styles.postHeader}>
              <Image
                source={{ uri: post.profileImage }}
                style={styles.avatar}
                defaultSource={require('../../assets/default-avatar.png')}
              />
              <View style={styles.postMeta}>
                <Text style={styles.author}>@{post.author}</Text>
                <Text style={styles.date}>
                  {post.created?.substring(0, 10)}
                </Text>
              </View>
            </View>

            <Text style={styles.postTitle} numberOfLines={2}>
              {post.title}
            </Text>

            {extractFirstImage(post.body) && (
              <Image
                source={{ uri: extractFirstImage(post.body) }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.postExcerpt} numberOfLines={3}>
              {stripMarkdown(post.body)}
            </Text>

            <View style={styles.postFooter}>
              <View style={styles.stats}>
                <Text style={styles.statText}>👍 {post.net_votes || 0}</Text>
                <Text style={styles.statText}>💬 {post.children || 0}</Text>
              </View>
              <Text style={styles.readMore}>Read more →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  postCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#00ffe5',
  },
  postMeta: {
    flex: 1,
  },
  author: {
    color: '#00ffe5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  date: {
    color: '#ccc',
    fontSize: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffe5',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postExcerpt: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 15,
  },
  statText: {
    color: '#ccc',
    fontSize: 12,
  },
  readMore: {
    color: '#ffcc00',
    fontSize: 12,
    fontWeight: 'bold',
  },
});