using System.Collections.Concurrent;
using FormulaOne.ChatService.models;

namespace FormulaOne.ChatService.DataService;

public class SharedDb
{
    private readonly ConcurrentDictionary<string, UserConnection> _connections;

    public ConcurrentDictionary<string, UserConnection> connections => _connections;

}