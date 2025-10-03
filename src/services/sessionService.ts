import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { SessionResults, SessionRecord } from '@/types/session';
import { Result, AppError } from '@/types/common';
import { LanguageId } from '@/types/problem';

const SESSIONS_COLLECTION = 'sessions';

export const sessionService = {
  /**
   * Save typing session results to Firestore
   */
  async saveResults(
    userId: string,
    languageId: LanguageId,
    results: SessionResults
  ): Promise<Result<SessionRecord, AppError>> {
    try {
      const sessionData = {
        userId,
        languageId,
        createdAt: Timestamp.now(),
        totalProblems: results.totalProblems,
        averageWPM: results.averageWPM,
        averageAccuracy: results.averageAccuracy,
        totalTimeSeconds: results.totalTimeSeconds,
        problemResults: results.problemResults,
      };

      const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);

      const sessionRecord: SessionRecord = {
        id: docRef.id,
        userId,
        languageId,
        createdAt: new Date(),
        results,
      };

      return { success: true, data: sessionRecord };
    } catch (error) {
      console.error('Error saving session:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR',
          message: 'セッションの保存に失敗しました',
        },
      };
    }
  },

  /**
   * Get user's session history
   */
  async getUserSessions(
    userId: string,
    limitCount: number = 10
  ): Promise<Result<SessionRecord[], AppError>> {
    try {
      const q = query(
        collection(db, SESSIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const sessions: SessionRecord[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          languageId: data.languageId,
          createdAt: data.createdAt.toDate(),
          results: {
            totalProblems: data.totalProblems,
            averageWPM: data.averageWPM,
            averageAccuracy: data.averageAccuracy,
            totalTimeSeconds: data.totalTimeSeconds,
            problemResults: data.problemResults,
          },
        };
      });

      return { success: true, data: sessions };
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR',
          message: 'セッション履歴の取得に失敗しました',
        },
      };
    }
  },

  /**
   * Get best record for a specific language
   */
  async getBestRecord(
    userId: string,
    languageId: LanguageId
  ): Promise<Result<SessionRecord | null, AppError>> {
    try {
      const q = query(
        collection(db, SESSIONS_COLLECTION),
        where('userId', '==', userId),
        where('languageId', '==', languageId),
        orderBy('averageWPM', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: true, data: null };
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      const sessionRecord: SessionRecord = {
        id: doc.id,
        userId: data.userId,
        languageId: data.languageId,
        createdAt: data.createdAt.toDate(),
        results: {
          totalProblems: data.totalProblems,
          averageWPM: data.averageWPM,
          averageAccuracy: data.averageAccuracy,
          totalTimeSeconds: data.totalTimeSeconds,
          problemResults: data.problemResults,
        },
      };

      return { success: true, data: sessionRecord };
    } catch (error) {
      console.error('Error getting best record:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR',
          message: '最高記録の取得に失敗しました',
        },
      };
    }
  },

  /**
   * Get session by ID
   */
  async getSessionById(sessionId: string): Promise<Result<SessionRecord, AppError>> {
    try {
      const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            type: 'NOT_FOUND',
            message: 'セッションが見つかりません',
          },
        };
      }

      const data = docSnap.data();
      const sessionRecord: SessionRecord = {
        id: docSnap.id,
        userId: data.userId,
        languageId: data.languageId,
        createdAt: data.createdAt.toDate(),
        results: {
          totalProblems: data.totalProblems,
          averageWPM: data.averageWPM,
          averageAccuracy: data.averageAccuracy,
          totalTimeSeconds: data.totalTimeSeconds,
          problemResults: data.problemResults,
        },
      };

      return { success: true, data: sessionRecord };
    } catch (error) {
      console.error('Error getting session:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR',
          message: 'セッションの取得に失敗しました',
        },
      };
    }
  },
};
