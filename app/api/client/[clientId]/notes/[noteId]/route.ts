import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// DELETE - Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string; noteId: string }> }
) {
  try {
    const { clientId, noteId } = await params;

    // Find the client first to verify it exists
    const client = await prisma.onboardingClient.findUnique({
      where: { clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Find the note to verify it exists and belongs to this client
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    if (note.clientId !== client.id) {
      return NextResponse.json(
        { error: 'Note does not belong to this client' },
        { status: 403 }
      );
    }

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId },
    });

    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        clientId: client.id,
        action: 'note_deleted',
        details: JSON.stringify({ noteId }),
        actor: 'System', // TODO: Replace with actual user when auth is implemented
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
