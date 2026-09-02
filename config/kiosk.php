<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Kiosk YouTube Video
    |--------------------------------------------------------------------------
    |
    | The video ID played on the TV display (/ticket). Override via the
    | KIOSK_YOUTUBE_VIDEO_ID environment variable.
    |
    */

    'youtube_video_id' => env('KIOSK_YOUTUBE_VIDEO_ID', '9TZKzh5A0q0'),

    /*
    |--------------------------------------------------------------------------
    | Kiosk Local Intro Video
    |--------------------------------------------------------------------------
    |
    | Path (relative to the public directory) of the locally hosted intro
    | video played on the TV display (/ticket). Overrides the YouTube embed
    | above when the file exists.
    |
    */

    'video_url' => env('KIOSK_VIDEO_URL', 'video/intro.mp4'),
];
