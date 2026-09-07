<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionFreshness
{
    public const LOGINED_AT_KEY = 'logined_at';

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user === null) {
            return $next($request);
        }
        $lifetime = (int) config('session.lifetime');
        $session = $request->session();
        $loginedAt = $session->get(self::LOGINED_AT_KEY);
        if ($loginedAt === null) {
            $session->put(self::LOGINED_AT_KEY, now()->timestamp);

            return $next($request);
        }
        if ((now()->timestamp - (int) $loginedAt) >= $lifetime * 60) {
            $this->logout($request);
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi anda sudah berakhir. Silakan login kembali.',
                    'data' => null,
                ], 401);
            }

            return redirect()->route('login');
        }

        return $next($request);
    }

    private function logout(Request $request): void
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
