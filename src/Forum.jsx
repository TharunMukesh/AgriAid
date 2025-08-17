import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './Firebase';
import { MessageCircle, Heart, User, Clock, Send, Search, Filter } from 'lucide-react';
import {
    collection, 
    addDoc, // adding a new document in the database
    orderBy, // orders are documents based on some factors which we can define
    query, // quering the document from the database
    serverTimestamp, // timestamp
    updateDoc, // updating the already existing doc
    doc, // document
    arrayUnion, // combining two diff arrays
    onSnapshot // capturing the current state of the document
} from 'firebase/firestore';
 
function Forum() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        title: '',
        content: '',
        category: 'general'
    });
    const [loading, setLoading] = useState(true);
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newAnswers, setNewAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [user,setUser] = useState(null);
    const [error, setError] = useState('');
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    const categories = [
        { value: 'all', label: 'All Categories'},
        { value: 'general', label: 'General Farming'},
        { value: 'crops', label: 'Crop Planning'},
        { value: 'rotation', label: 'Crop Rotation'},
        { value: 'weather', label: 'Weather & Climate'},
        { value: 'pests', label: 'Pest Control'},
        { value: 'equipment', label: 'Equipment'}
    ];

    // check auth state
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setAuthLoading(false);

            if(!currentUser) {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    },[navigate]);

    // load questions from Firebase
    useEffect(()=>{
        if(!user) return;
        const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q,(querySnapshot)=> {
            const questionsData = [];
            querySnapshot.forEach((doc)=>{
                const data = doc.data();
                questionsData.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt || new Date()
                });
            });

            setQuestions(questionsData);
            setLoading(false);
        }, (error)=>{
            console.error('Error loading questions:', error);
            setError('Failed to load questions. Please check again');
            setLoading(false);
        })

        return ()=> unsubscribe();
    },[user])

    const handleSubmitQuestion = async(e) => {
        e.preventDefault();

        if(!user){
            setError('you must be logged in to post a question');
            navigate('/signup');
            return;
        }

        if(!newQuestion.title.trim() || !newQuestion.content.trim()){
            setError(' please fill in both title and content.');
            return;
        }
        setSubmitting(true);
        setError('');

        try {
            await addDoc(collection(db, 'questions'), {
                ...newQuestion,
                createdAt: serverTimestamp(),
                author: user.displayName || user.email || 'Anonymous User',
                authorId: user.uid,
                answers: [],
                likes: 0,
                likedBy: []
            });

            setNewQuestion({
                title: '',
                content: '',
                category: 'general'
            });
            setShowNewQuestionForm(false);
            setSubmitting(false);

        } catch(error) {
            console.error('Error adding questions:', error);
            setError('Failed to submit question. Please try again');
            setSubmitting(false);
        }
    };

    const handleSubmitAnswer = async (questionId, answerContent) => {
        if(!user){
            setError('you must be logged in to post an answer');
            navigate('/signup');
            return;
        }

        if(!answerContent.trim()) return;

        try {
            const questionRef = doc(db,'questions', questionId);
            await updateDoc(questionRef, {
                answers: arrayUnion({
                    id: Date.now().toString(),
                    content: answerContent,
                    author: user.displayName || user.email || 'Anonymous User',
                    authorId: user.uid,
                    createdAt: new Date(),
                    likes: 0
                })
            });
            setNewAnswers({
                ...newAnswers,
                [questionId]: ''
            });
        } catch (error) {
            console.error('Error adding answers: ', error);
            setError('Failed to submit answer. Please try again');
        }
    };

    const handleLikeQuestion = async(questionId) => {
        if(!user){
            setError('you must be logged in to like a question');
            navigate('/signup');
            return;
        }
        try {
            const questionRef = doc(db,'questions', questionId);
            const question = questions.find(q=> q.id === questionId);

            if(question.likedBy && question.likedBy.includes(user.uid)){
                setError('You have already liked this question');
                return;
            }

            await updateDoc(questionRef, {
                likes: (question.likes || 0) + 1,
                likedBy : arrayUnion(user.uid)
            });
        } catch (error) {
            console.error('Error liking question: ', error);
            setError('Failed to like a question. Please try again.');
        }
    };

    const handleLogout = async() => {
        try {
            await auth.signOut();
            navigate('/signup');
        } catch (error) {
            console.error('error signing out: ', error);
        }
    };

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            question.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
        return matchesSearch && matchesCategory;            
    });

    const formatDate = (timestamp) => {
        if(!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + 'at' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    };

    if(authLoading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <p className='mt-2 text-gray-600'>Checking authentication...</p>
                </div>
            </div>
        );
    }

    if(!user) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className=" text-center bg-white p-8 rounded-xl shadow-md">
                    <h2 className='text-2xl font-bold text-gray-900 mb-4'>Authentication Required</h2>
                    <p className='text-gray-600 mb-6'>You need to be logged in to access the forum.</p>
                    <button onClick={()=>navigate('/signup')} className='bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700'>
                        Go to Sign Up
                    </button>
                </div>
            </div>
        );
    }
   return (
    <div className='min-h-screen bg-amber-50'>
        {/* Naviagtion */}
        <nav className='bg-white shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16'>
                    <div className='flex items-center'>
                        <span className='text-2xl font-bold text-amber-600'>Website Forum</span>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <a href="/" className='text-gray-700 hover:text-amber-600'>Home</a>
                        <a href="#" className='text-gray-700 hover:text-amber-600'>Forum</a>
                        <a href="#" className='text-gray-700 hover:text-amber-600'>Services</a>
                        <div className='flex items-center space-x-2'>
                            <span className='text-gray-700'>Welcome {user.displayName}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        
        <div className='bg-gradient-to-b from-amber-100 to-amber-50 py-8'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h1 className='text-3xl font-bold text-gray-900 text-center mb-4'>
                    Farming Community Forum
                </h1>
                <p className='text-lg text-gray-600 text-center mb-6'>
                    Ask questions, share knowledge, and connect with fellow farmers
                </p>

                <div className='flex flex-col sm:flex-row gap-4 mb-6'>
                    <div className='relative flex-1'>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input 
                            type="text"
                            placeholder='Search questions...'
                            value={searchTerm}
                            onChange={(e)=>setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" 
                        />
                    </div>
                    <div className='relative'>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 "/>
                        <select
                            value={selectedCategory}
                            onChange={(e)=> setSelectedCategory(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ask question button */}
                <div className='text-center'>
                    <button
                        onClick={()=> setShowNewQuestionForm(!showNewQuestionForm)}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 shadow-md"
                    >
                        Ask a question
                    </button>
                </div>
            </div>
        </div>

        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button 
                        onClick={()=>setError('')}
                        className="float-right text-red-700 hover:text-red-900"
                    >
                        x
                    </button>
                </div>
            )}

            {/* new question form */}
            {showNewQuestionForm && (
                <div className="bg-white rounded-xl p-6 shadow-md mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Ask a New Question</h3>
                    <form onSubmit={handleSubmitQuestion}>
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                            <select 
                                value={newQuestion.category}
                                onChange={(e)=> setNewQuestion({ ...newQuestion, category: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"                          
                            >
                                {categories.slice(1).map(cat=> (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
 
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
                            <input 
                                type="text" 
                                value={newQuestion.title} 
                                onChange={(e)=>setNewQuestion({...newQuestion, title: e.target.value})}
                                placeholder="what's your question about?"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                required
                            />
                        </div>   
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question Details</label>
                            <textarea 
                                value={newQuestion.content} 
                                onChange={(e)=>setNewQuestion({...newQuestion, content: e.target.value})}
                                placeholder="Provide more details on your question"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                required
                            />
                        </div> 
                        <div className='flex gap-4'>
                            <button 
                                type='submit'
                                disabled={submitting}
                                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Posting...': 'Post Question'}
                            </button>
                            <button
                                type='button'
                                onClick={()=>setShowNewQuestionForm(false)}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>            
                    </form>
                </div>
            )}
            
            {/* Questions List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <p className="mt-2 text-gray-600"> Loading Questions...</p>
                </div>
            ):(
                <div>
                    {filteredQuestions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No questions found. Be the first to add</p>
                        </div>
                    ):(
                        filteredQuestions.map((question)=> (
                            <div key={question.id} className="bg-white rounded-xl p-6 shadow-md mb-2">
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <span className='bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium'>
                                                {categories.find(cat=> cat.value === question.category)?.label || 'General'}
                                            </span>
                                            <span className='text-gray-500 text-sm flex items-center gap-1'>
                                                <Clock className="w-4 h-4"/>
                                                {formatDate(question.createdAt)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.title}</h3>
                                        <p className='text-gray-700 mb-4'>{question.content}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4"/>
                                                {question.author}
                                            </span>
                                            <button
                                                onClick={()=>handleLikeQuestion(question.id)}
                                                className={`flex items-center gap-1 hover:text-amber-600 ${
                                                    question.likedBy && question.likedBy.includes(user.uid)
                                                    ? 'text-red-500'
                                                    : ''
                                                }`}
                                                disabled={question.likedBy && question.likedBy.includes(user.uid)}
                                            >
                                                <Heart 
                                                    className={`w-4 h-4 ${
                                                        question.likedBy && question.likedBy.includes(user.uid)
                                                        ? 'fill-current'
                                                        : ''
                                                    }`}
                                                />
                                                {question.likes || 0}
                                            </button>
                                            <span className='flex items-center gap-1'>
                                                <MessageCircle className="w-4 h-4"/>
                                                {question.answers?.length || 0} answers
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* answers */}
                                {question.answers && question.answers.length > 0 && (
                                    <div className='border-t pt-4 mt-4'>
                                        <h4 className='font-medium text-gray-900 mb-3'>Answers:</h4>
                                        <div className='space-y-3'>
                                            {question.answers.map((answer) => (
                                                <div key={answer.id} className="bg-amber-50 rounded-lg p-4">
                                                    <p className="text-gray-700 mb-2">{answer.content}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className='flex items-center gap-1'>
                                                            <User className="w-3 h-3"/>
                                                            {answer.author}
                                                        </span>
                                                        <span className='flex items-center gap-1'>
                                                            <Clock className="w-3 h-3"/>
                                                            {formatDate(answer.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Add answer */}
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={newAnswers[question.id] || '' } 
                                            onChange={(e)=> setNewAnswers({ ...newAnswers, [question.id]: e.target.value})}
                                            placeholder="Write your answer..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            onKeyPress={(e)=> {
                                                if(e.key === 'Enter') {
                                                    handleSubmitAnswer(question.id, newAnswers[question.id] || '');
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={()=> handleSubmitAnswer(question.id, newAnswers[question.id] || '')}
                                            className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700'
                                        >
                                            <Send className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
        {/* chat support */}
        <div className="flxed bottom-6 right-6">
            <button className="bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700">
                <MessageCircle size={24} />
            </button>
        </div>
    </div>
  )
}

export default Forum