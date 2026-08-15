/*
# 10 kl. Lygčių sistemos — tema ir potemės (Horizontai)
*/

UPDATE curriculum_topics
SET title = 'Lygčių sistemos, kurių tik viena lygtis tiesinė'
WHERE grade = 10 AND slug = '10-lygciu-sistemos';

UPDATE curriculum_subtopics s
SET title = 'Lygčių sistemų, kurių viena lygtis yra tiesinė, o kita - trupmeninė arba kvadratinė, sprendimas'
FROM curriculum_topics t
WHERE s.topic_id = t.id
  AND t.grade = 10
  AND t.slug = '10-lygciu-sistemos'
  AND s.slug = 'lygciu-sistemu-sprendimas';
