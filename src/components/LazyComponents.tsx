"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load heavy 3D components
export const ThreeCanvas = dynamic(() => import('./ThreeCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading 3D Experience...</p>
            </div>
        </div>
    )
});

export const ThreeJsShowcase = dynamic(() => import('./ThreeJsShowcase'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
                <div className="animate-pulse h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="animate-pulse h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    )
});

export const TechSolarSystem = dynamic(() => import('./TechSolarSystem'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-96 flex items-center justify-center bg-black rounded-lg">
            <div className="text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Loading Solar System...</p>
            </div>
        </div>
    )
});

export const SpaceShooterGame = dynamic(() => import('./SpaceShooterGame'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-96 flex items-center justify-center bg-gradient-to-b from-purple-900 to-black rounded-lg">
            <div className="text-center text-white">
                <div className="animate-bounce h-6 w-6 bg-white rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Loading Game...</p>
            </div>
        </div>
    )
});

export const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
    )
});

// Lazy load particle effects
export const ParticleBackground = dynamic(() => import('react-tsparticles').then(mod => mod.default), {
    ssr: false,
    loading: () => null
});

// Lazy load Spline components
export const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    )
});